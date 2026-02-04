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
exports.CarpoolService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const vehicles_service_1 = require("../vehicles/vehicles.service");
let CarpoolService = class CarpoolService {
    constructor(prisma, vehiclesService) {
        this.prisma = prisma;
        this.vehiclesService = vehiclesService;
    }
    async createTrip(driverId, dto) {
        const isApprovedAndOwned = await this.vehiclesService.isVehicleApprovedAndOwnedBy(dto.vehicleId, driverId);
        if (!isApprovedAndOwned) {
            throw new common_1.BadRequestException('Le véhicule doit être approuvé et vous appartenir pour créer un trajet');
        }
        const vehicle = await this.vehiclesService.findById(dto.vehicleId);
        if (!vehicle.isForCarpooling) {
            throw new common_1.BadRequestException('Ce véhicule n\'est pas disponible pour le covoiturage');
        }
        if (dto.availableSeats > vehicle.numberOfSeats - 1) {
            throw new common_1.BadRequestException(`Le nombre de places disponibles ne peut pas dépasser ${vehicle.numberOfSeats - 1} (places du véhicule moins le conducteur)`);
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
    async searchTrips(dto) {
        const where = {
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
    async findTripById(id) {
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
            throw new common_1.NotFoundException('Trajet non trouvé');
        }
        return trip;
    }
    async reserveWithTransaction(tripId, passengerId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const trip = await tx.carpoolTrip.findUnique({
                where: { id: tripId },
                include: { driver: true },
            });
            if (!trip) {
                throw new common_1.NotFoundException('Trajet non trouvé');
            }
            if (trip.status !== 'OPEN') {
                throw new common_1.BadRequestException('Ce trajet n\'est plus disponible');
            }
            if (trip.driverId === passengerId) {
                throw new common_1.BadRequestException('Vous ne pouvez pas réserver votre propre trajet');
            }
            const existingReservation = await tx.carpoolReservation.findFirst({
                where: {
                    tripId,
                    passengerId,
                    status: { in: ['PENDING', 'CONFIRMED'] },
                },
            });
            if (existingReservation) {
                throw new common_1.ConflictException('Vous avez déjà une réservation pour ce trajet');
            }
            if (dto.seatsReserved > trip.availableSeats) {
                throw new common_1.BadRequestException(`Seulement ${trip.availableSeats} place(s) disponible(s)`);
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
    async acceptReservation(reservationId, driverId) {
        return this.prisma.$transaction(async (tx) => {
            const reservation = await tx.carpoolReservation.findUnique({
                where: { id: reservationId },
                include: { trip: true },
            });
            if (!reservation) {
                throw new common_1.NotFoundException('Réservation non trouvée');
            }
            if (reservation.trip.driverId !== driverId) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
            }
            if (reservation.status !== 'PENDING') {
                throw new common_1.BadRequestException('Cette réservation ne peut plus être acceptée');
            }
            if (reservation.seatsReserved > reservation.trip.availableSeats) {
                throw new common_1.BadRequestException('Plus assez de places disponibles');
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
    async rejectReservation(reservationId, driverId) {
        const reservation = await this.prisma.carpoolReservation.findUnique({
            where: { id: reservationId },
            include: { trip: true },
        });
        if (!reservation) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        if (reservation.trip.driverId !== driverId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
        }
        if (reservation.status !== 'PENDING') {
            throw new common_1.BadRequestException('Cette réservation ne peut plus être refusée');
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
    async cancelTrip(tripId, driverId) {
        return this.prisma.$transaction(async (tx) => {
            const trip = await tx.carpoolTrip.findUnique({
                where: { id: tripId },
            });
            if (!trip) {
                throw new common_1.NotFoundException('Trajet non trouvé');
            }
            if (trip.driverId !== driverId) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
            }
            if (trip.status === 'CANCELLED' || trip.status === 'COMPLETED') {
                throw new common_1.BadRequestException('Ce trajet ne peut plus être annulé');
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
    async cancelReservationByPassenger(reservationId, passengerId) {
        return this.prisma.$transaction(async (tx) => {
            const reservation = await tx.carpoolReservation.findUnique({
                where: { id: reservationId },
                include: { trip: true },
            });
            if (!reservation) {
                throw new common_1.NotFoundException('Réservation non trouvée');
            }
            if (reservation.passengerId !== passengerId) {
                throw new common_1.ForbiddenException('Vous ne pouvez annuler que vos propres réservations');
            }
            if (reservation.status === 'CANCELLED' || reservation.status === 'REJECTED') {
                throw new common_1.BadRequestException('Cette réservation est déjà annulée ou refusée');
            }
            if (reservation.status === 'COMPLETED') {
                throw new common_1.BadRequestException('Cette réservation est déjà terminée');
            }
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
    async completeTrip(tripId, driverId) {
        return this.prisma.$transaction(async (tx) => {
            const trip = await tx.carpoolTrip.findUnique({
                where: { id: tripId },
            });
            if (!trip) {
                throw new common_1.NotFoundException('Trajet non trouvé');
            }
            if (trip.driverId !== driverId) {
                throw new common_1.ForbiddenException('Vous n\'êtes pas le conducteur de ce trajet');
            }
            if (trip.status === 'CANCELLED') {
                throw new common_1.BadRequestException('Un trajet annulé ne peut pas être complété');
            }
            if (trip.status === 'COMPLETED') {
                throw new common_1.BadRequestException('Ce trajet est déjà complété');
            }
            await tx.carpoolReservation.updateMany({
                where: {
                    tripId,
                    status: 'CONFIRMED',
                },
                data: { status: 'COMPLETED' },
            });
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
    async getMyReservations(passengerId) {
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
    async getMyTrips(driverId) {
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
};
exports.CarpoolService = CarpoolService;
exports.CarpoolService = CarpoolService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicles_service_1.VehiclesService])
], CarpoolService);
//# sourceMappingURL=carpool.service.js.map