"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let AdminService = class AdminService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatistics() {
        const [totalUsers, totalVehicles, pendingVehicles, approvedVehicles, rejectedVehicles, totalCarpoolTrips, openCarpoolTrips, completedCarpoolTrips, totalRentalOffers, activeRentalOffers, totalCarpoolReservations, totalRentalBookings,] = await Promise.all([
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
    async findVehicles(status) {
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
    async getVehicleById(id) {
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
            throw new common_1.NotFoundException('Véhicule non trouvé');
        }
        return vehicle;
    }
    async approveVehicle(id) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Véhicule non trouvé');
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
    async rejectVehicle(id, comment) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Véhicule non trouvé');
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
    async findUsers(search) {
        const where = search
            ? {
                OR: [
                    { email: { contains: search, mode: 'insensitive' } },
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
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
    async getUserById(id) {
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
            throw new common_1.NotFoundException('Utilisateur non trouvé');
        }
        return user;
    }
    async updateUserRole(id, role) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
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
    async toggleUserActive(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur non trouvé');
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map