import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { VehicleStatus } from './dto/admin-vehicle.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // ============== STATISTICS ==============
  async getStatistics() {
    const [
      totalUsers,
      totalVehicles,
      pendingVehicles,
      approvedVehicles,
      rejectedVehicles,
      totalCarpoolTrips,
      openCarpoolTrips,
      completedCarpoolTrips,
      totalRentalOffers,
      activeRentalOffers,
      totalCarpoolReservations,
      totalRentalBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.vehicle.count(),
      this.prisma.vehicle.count({ where: { status: 'PENDING' } }),
      this.prisma.vehicle.count({ where: { status: 'APPROVED' } }),
      this.prisma.vehicle.count({ where: { status: 'REJECTED' } }),
      this.prisma.carpoolTrip.count(),
      this.prisma.carpoolTrip.count({ where: { status: 'OPEN' } }),
      this.prisma.carpoolTrip.count({ where: { status: 'COMPLETED' } }),
      this.prisma.rentalOffer.count(),
      this.prisma.rentalOffer.count({ where: { isActive: true } }),
      this.prisma.carpoolReservation.count(),
      this.prisma.rentalBooking.count(),
    ]);

    // Recent activity
    const recentVehicles = await this.prisma.vehicle.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return {
      users: {
        total: totalUsers,
      },
      vehicles: {
        total: totalVehicles,
        pending: pendingVehicles,
        approved: approvedVehicles,
        rejected: rejectedVehicles,
      },
      carpool: {
        totalTrips: totalCarpoolTrips,
        openTrips: openCarpoolTrips,
        completedTrips: completedCarpoolTrips,
        totalReservations: totalCarpoolReservations,
      },
      rental: {
        totalOffers: totalRentalOffers,
        activeOffers: activeRentalOffers,
        totalBookings: totalRentalBookings,
      },
      recentVehicles,
      recentUsers,
    };
  }

  // ============== VEHICLES ==============
  async findVehicles(status?: VehicleStatus) {
    const where = status ? { status } : {};

    return this.prisma.vehicle.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
          },
        },
        photos: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            photoUrl: true,
            createdAt: true,
          },
        },
        photos: true,
        documents: true,
        carpoolTrips: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
        rentalOffer: true,
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Véhicule non trouvé');
    }

    return vehicle;
  }

  async approveVehicle(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Véhicule non trouvé');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        status: 'APPROVED',
        adminComment: null,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        photos: true,
        documents: true,
      },
    });
  }

  async rejectVehicle(id: string, comment?: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Véhicule non trouvé');
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminComment: comment || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        photos: true,
        documents: true,
      },
    });
  }

  // ============== USERS ==============
  async findUsers(search?: string) {
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: {
            vehicles: true,
            carpoolTripsAsDriver: true,
            carpoolReservations: true,
            rentalBookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        photoUrl: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        vehicles: {
          include: {
            photos: true,
          },
        },
        carpoolTripsAsDriver: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        carpoolReservations: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            trip: true,
          },
        },
        rentalBookings: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            rentalOffer: {
              include: {
                vehicle: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return user;
  }

  async updateUserRole(id: string, role: 'USER' | 'ADMIN') {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }

  async toggleUserActive(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }
}
