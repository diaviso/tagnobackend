import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchOfferDto } from './dto/search-offer.dto';

@Injectable()
export class RentalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async createOffer(ownerId: string, dto: CreateOfferDto) {
    const isApprovedAndOwned = await this.vehiclesService.isVehicleApprovedAndOwnedBy(
      dto.vehicleId,
      ownerId,
    );

    if (!isApprovedAndOwned) {
      throw new BadRequestException(
        'Le véhicule doit être approuvé et vous appartenir pour créer une offre',
      );
    }

    const vehicle = await this.vehiclesService.findById(dto.vehicleId);
    if (!vehicle.isForRental) {
      throw new BadRequestException('Ce véhicule n\'est pas disponible pour la location');
    }

    const existingOffer = await this.prisma.rentalOffer.findUnique({
      where: { vehicleId: dto.vehicleId },
    });

    if (existingOffer) {
      throw new ConflictException('Une offre existe déjà pour ce véhicule');
    }

    return this.prisma.rentalOffer.create({
      data: {
        vehicleId: dto.vehicleId,
        pricePerDay: dto.pricePerDay,
        depositAmount: dto.depositAmount,
        minDays: dto.minDays || 1,
        isActive: dto.isActive ?? true,
      },
      include: {
        vehicle: true,
      },
    });
  }

  async updateOffer(offerId: string, ownerId: string, dto: UpdateOfferDto) {
    const offer = await this.prisma.rentalOffer.findUnique({
      where: { id: offerId },
      include: { vehicle: true },
    });

    if (!offer) {
      throw new NotFoundException('Offre non trouvée');
    }

    if (offer.vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres offres');
    }

    return this.prisma.rentalOffer.update({
      where: { id: offerId },
      data: dto,
      include: {
        vehicle: true,
      },
    });
  }

  async searchOffers(dto?: SearchOfferDto) {
    const where: any = {
      isActive: true,
      vehicle: {
        status: 'APPROVED',
        isActive: true,
      },
    };

    // Filtre par ville (recherche dans la marque, modèle pour simplifier sans géoloc)
    // Note: Sans géolocalisation, on ne peut pas filtrer par ville directement
    // On pourrait ajouter un champ "city" au véhicule si nécessaire

    // Filtre par disponibilité sur les dates demandées
    if (dto?.startDate && dto?.endDate) {
      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      // Exclure les offres qui ont des réservations confirmées qui chevauchent les dates
      where.bookings = {
        none: {
          status: 'CONFIRMED',
          OR: [
            {
              AND: [
                { startDate: { lte: startDate } },
                { endDate: { gt: startDate } },
              ],
            },
            {
              AND: [
                { startDate: { lt: endDate } },
                { endDate: { gte: endDate } },
              ],
            },
            {
              AND: [
                { startDate: { gte: startDate } },
                { endDate: { lte: endDate } },
              ],
            },
          ],
        },
      };
    }

    return this.prisma.rentalOffer.findMany({
      where,
      include: {
        vehicle: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
            photos: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOfferById(id: string) {
    const offer = await this.prisma.rentalOffer.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
            photos: true,
          },
        },
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            status: true,
          },
        },
      },
    });

    if (!offer) {
      throw new NotFoundException('Offre non trouvée');
    }

    return offer;
  }

  async createBookingWithOverlapCheck(
    offerId: string,
    renterId: string,
    dto: CreateBookingDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const offer = await tx.rentalOffer.findUnique({
        where: { id: offerId },
        include: { vehicle: true },
      });

      if (!offer) {
        throw new NotFoundException('Offre non trouvée');
      }

      if (!offer.isActive) {
        throw new BadRequestException('Cette offre n\'est plus active');
      }

      if (offer.vehicle.ownerId === renterId) {
        throw new BadRequestException('Vous ne pouvez pas louer votre propre véhicule');
      }

      const startDate = new Date(dto.startDate);
      const endDate = new Date(dto.endDate);

      if (startDate >= endDate) {
        throw new BadRequestException('La date de fin doit être après la date de début');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new BadRequestException('La date de début ne peut pas être dans le passé');
      }

      const nbDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (nbDays < offer.minDays) {
        throw new BadRequestException(
          `La durée minimale de location est de ${offer.minDays} jour(s)`,
        );
      }

      const overlappingBooking = await tx.rentalBooking.findFirst({
        where: {
          rentalOfferId: offerId,
          status: 'CONFIRMED',
          OR: [
            {
              AND: [
                { startDate: { lte: startDate } },
                { endDate: { gt: startDate } },
              ],
            },
            {
              AND: [
                { startDate: { lt: endDate } },
                { endDate: { gte: endDate } },
              ],
            },
            {
              AND: [
                { startDate: { gte: startDate } },
                { endDate: { lte: endDate } },
              ],
            },
          ],
        },
      });

      if (overlappingBooking) {
        throw new ConflictException(
          'Ce véhicule est déjà réservé pour ces dates',
        );
      }

      const totalPrice = offer.pricePerDay * nbDays;

      return tx.rentalBooking.create({
        data: {
          rentalOfferId: offerId,
          renterId,
          startDate,
          endDate,
          totalPrice,
          status: 'PENDING',
        },
        include: {
          rentalOffer: {
            include: {
              vehicle: true,
            },
          },
          renter: {
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

  async acceptBooking(bookingId: string, ownerId: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id: bookingId },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Cette réservation ne peut plus être acceptée');
    }

    return this.prisma.rentalBooking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async rejectBooking(bookingId: string, ownerId: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id: bookingId },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Cette réservation ne peut plus être refusée');
    }

    return this.prisma.rentalBooking.update({
      where: { id: bookingId },
      data: { status: 'REJECTED' },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async cancelBookingByRenter(bookingId: string, renterId: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id: bookingId },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.renterId !== renterId) {
      throw new ForbiddenException('Vous ne pouvez annuler que vos propres réservations');
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      throw new BadRequestException('Cette réservation est déjà annulée ou refusée');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cette réservation est déjà terminée');
    }

    return this.prisma.rentalBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async getMyBookings(renterId: string) {
    return this.prisma.rentalBooking.findMany({
      where: { renterId },
      include: {
        rentalOffer: {
          include: {
            vehicle: {
              include: {
                owner: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    photoUrl: true,
                  },
                },
                photos: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMyOffers(ownerId: string) {
    return this.prisma.rentalOffer.findMany({
      where: {
        vehicle: {
          ownerId,
        },
      },
      include: {
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            color: true,
            licensePlate: true,
            status: true,
          },
        },
        bookings: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] },
          },
          include: {
            renter: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                photoUrl: true,
              },
            },
          },
          orderBy: { startDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async completeBooking(bookingId: string, ownerId: string) {
    const booking = await this.prisma.rentalBooking.findUnique({
      where: { id: bookingId },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Réservation non trouvée');
    }

    if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
      throw new ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
    }

    if (booking.status !== 'CONFIRMED') {
      throw new BadRequestException('Seule une réservation confirmée peut être complétée');
    }

    return this.prisma.rentalBooking.update({
      where: { id: bookingId },
      data: { status: 'COMPLETED' },
      include: {
        rentalOffer: {
          include: { vehicle: true },
        },
        renter: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
