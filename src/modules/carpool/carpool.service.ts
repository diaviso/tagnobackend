import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';

@Injectable()
export class CarpoolService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createTrip(driverId: string, dto: CreateTripDto) {
    const isApprovedAndOwned = await this.vehiclesService.isVehicleApprovedAndOwnedBy(
      dto.vehicleId,
      driverId,
    );

    if (!isApprovedAndOwned) {
      throw new BadRequestException(
        'Le véhicule doit être approuvé et vous appartenir pour créer un trajet',
      );
    }

    const vehicle = await this.vehiclesService.findById(dto.vehicleId);
    if (!vehicle.isForCarpooling) {
      throw new BadRequestException('Ce véhicule n\'est pas disponible pour le covoiturage');
    }

    if (dto.availableSeats > vehicle.numberOfSeats - 1) {
      throw new BadRequestException(
        `Le nombre de places disponibles ne peut pas dépasser ${vehicle.numberOfSeats - 1} (places du véhicule moins le conducteur)`,
      );
    }

    return this.prisma.carpoolTrip.create({
      data: {
        vehicleId: dto.vehicleId,
        driverId,
        departureCity: dto.departureCity,
        arrivalCity: dto.arrivalCity,
        departureTime: new Date(dto.departureTime),
        pricePerSeat: dto.pricePerSeat,
        availableSeats: dto.availableSeats,
      },
      include: {
        vehicle: true,
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
    });
  }

  async searchTrips(dto: SearchTripDto) {
    const where: any = {
      status: 'OPEN',
      departureTime: { gte: new Date() },
      vehicle: {
        isActive: true,
      },
    };

    if (dto.from) {
      where.departureCity = { contains: dto.from, mode: 'insensitive' };
    }

    if (dto.to) {
      where.arrivalCity = { contains: dto.to, mode: 'insensitive' };
    }

    if (dto.date) {
      const startOfDay = new Date(dto.date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dto.date);
      endOfDay.setHours(23, 59, 59, 999);

      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (dto.seats) {
      where.availableSeats = { gte: dto.seats };
    }

    return this.prisma.carpoolTrip.findMany({
      where,
      include: {
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            color: true,
          },
        },
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
      },
      orderBy: { departureTime: 'asc' },
    });
  }

  async findTripById(id: string) {
    const trip = await this.prisma.carpoolTrip.findUnique({
      where: { id },
      include: {
        vehicle: true,
        driver: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
        reservations: {
          include: {
            passenger: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!trip) {
      throw new NotFoundException('Trajet non trouvé');
    }

    return trip;
  }

  async reserveWithTransaction(
    tripId: string,
    passengerId: string,
    dto: CreateReservationDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const trip = await tx.carpoolTrip.findUnique({
        where: { id: tripId },
        include: { driver: true },
      });

      if (!trip) {
        throw new NotFoundException('Trajet non trouvé');
      }

      if (trip.status !== 'OPEN') {
        throw new BadRequestException('Ce trajet n\'est plus disponible');
      }

      if (trip.driverId === passengerId) {
        throw new BadRequestException('Vous ne pouvez pas réserver votre propre trajet');
      }

      const existingReservation = await tx.carpoolReservation.findFirst({
        where: {
          tripId,
          passengerId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
      });

      if (existingReservation) {
        throw new ConflictException('Vous avez déjà une réservation pour ce trajet');
      }

      if (dto.seatsReserved > trip.availableSeats) {
        throw new BadRequestException(
          `Seulement ${trip.availableSeats} place(s) disponible(s)`,
        );
      }

      const reservation = await tx.carpoolReservation.create({
        data: {
          tripId,
          passengerId,
          seatsReserved: dto.seatsReserved,
          status: 'PENDING',
        },
        include: {
          trip: true,
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return reservation;
    });
  }

  async acceptReservation(reservationId: string, driverId: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.carpoolReservation.findUnique({
        where: { id: reservationId },
        include: { trip: true },
      });

      if (!reservation) {
        throw new NotFoundException('Réservation non trouvée');
      }

      if (reservation.trip.driverId !== driverId) {
        throw new ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
      }

      if (reservation.status !== 'PENDING') {
        throw new BadRequestException('Cette réservation ne peut plus être acceptée');
      }

      if (reservation.seatsReserved > reservation.trip.availableSeats) {
        throw new BadRequestException('Plus assez de places disponibles');
      }

      const newAvailableSeats = reservation.trip.availableSeats - reservation.seatsReserved;

      await tx.carpoolTrip.update({
        where: { id: reservation.tripId },
        data: {
          availableSeats: newAvailableSeats,
          status: newAvailableSeats === 0 ? 'FULL' : 'OPEN',
        },
      });

      return tx.carpoolReservation.update({
        where: { id: reservationId },
        data: { status: 'CONFIRMED' },
        include: {
          trip: true,
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });
  }

  async rejectReservation(reservationId: string, driverId: string) {
    const reservation = await this.prisma.carpoolReservation.findUnique({
      where: { id: reservationId },
      include: { trip: true },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (reservation.trip.driverId !== driverId) {
      throw new ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
    }

    if (reservation.status !== 'PENDING') {
      throw new BadRequestException('Cette réservation ne peut plus être refusée');
    }

    return this.prisma.carpoolReservation.update({
      where: { id: reservationId },
      data: { status: 'REJECTED' },
      include: {
        trip: true,
        passenger: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async cancelTrip(tripId: string, driverId: string) {
    return this.prisma.$transaction(async (tx) => {
      const trip = await tx.carpoolTrip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException('Trajet non trouvé');
      }

      if (trip.driverId !== driverId) {
        throw new ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
      }

      if (trip.status === 'CANCELLED' || trip.status === 'COMPLETED') {
        throw new BadRequestException('Ce trajet ne peut plus être annulé');
      }

      await tx.carpoolReservation.updateMany({
        where: {
          tripId,
          status: { in: ['PENDING', 'CONFIRMED'] },
        },
        data: { status: 'CANCELLED' },
      });

      return tx.carpoolTrip.update({
        where: { id: tripId },
        data: { status: 'CANCELLED' },
        include: {
          vehicle: true,
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });
  }

  async cancelReservationByPassenger(reservationId: string, passengerId: string) {
    return this.prisma.$transaction(async (tx) => {
      const reservation = await tx.carpoolReservation.findUnique({
        where: { id: reservationId },
        include: { trip: true },
      });

      if (!reservation) {
        throw new NotFoundException('Réservation non trouvée');
      }

      if (reservation.passengerId !== passengerId) {
        throw new ForbiddenException('Vous ne pouvez annuler que vos propres réservations');
      }

      if (reservation.status === 'CANCELLED' || reservation.status === 'REJECTED') {
        throw new BadRequestException('Cette réservation est déjà annulée ou refusée');
      }

      if (reservation.status === 'COMPLETED') {
        throw new BadRequestException('Cette réservation est déjà terminée');
      }

      // Si la réservation était confirmée, on restitue les places
      if (reservation.status === 'CONFIRMED') {
        const newAvailableSeats = reservation.trip.availableSeats + reservation.seatsReserved;

        await tx.carpoolTrip.update({
          where: { id: reservation.tripId },
          data: {
            availableSeats: newAvailableSeats,
            status: reservation.trip.status === 'FULL' ? 'OPEN' : reservation.trip.status,
          },
        });
      }

      return tx.carpoolReservation.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' },
        include: {
          trip: true,
          passenger: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
    });
  }

  async completeTrip(tripId: string, driverId: string) {
    return this.prisma.$transaction(async (tx) => {
      const trip = await tx.carpoolTrip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new NotFoundException('Trajet non trouvé');
      }

      if (trip.driverId !== driverId) {
        throw new ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
      }

      if (trip.status === 'CANCELLED') {
        throw new BadRequestException('Un trajet annulé ne peut pas être complété');
      }

      if (trip.status === 'COMPLETED') {
        throw new BadRequestException('Ce trajet est déjà complété');
      }

      // Marquer toutes les réservations confirmées comme complétées
      await tx.carpoolReservation.updateMany({
        where: {
          tripId,
          status: 'CONFIRMED',
        },
        data: { status: 'COMPLETED' },
      });

      // Annuler les réservations encore en attente
      await tx.carpoolReservation.updateMany({
        where: {
          tripId,
          status: 'PENDING',
        },
        data: { status: 'CANCELLED' },
      });

      return tx.carpoolTrip.update({
        where: { id: tripId },
        data: { status: 'COMPLETED' },
        include: {
          vehicle: true,
          driver: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          reservations: {
            include: {
              passenger: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });
    });
  }

  async getMyReservations(passengerId: string) {
    return this.prisma.carpoolReservation.findMany({
      where: { passengerId },
      include: {
        trip: {
          include: {
            vehicle: {
              select: {
                id: true,
                brand: true,
                model: true,
                color: true,
              },
            },
            driver: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyTrips(driverId: string) {
    return this.prisma.carpoolTrip.findMany({
      where: { driverId },
      include: {
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            color: true,
            licensePlate: true,
          },
        },
        reservations: {
          include: {
            passenger: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
        },
      },
      orderBy: { departureTime: 'desc' },
    });
  }
}
