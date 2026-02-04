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
exports.RentalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const vehicles_service_1 = require("../vehicles/vehicles.service");
let RentalService = class RentalService {
    constructor(prisma, vehiclesService) {
        this.prisma = prisma;
        this.vehiclesService = vehiclesService;
    }
    async createOffer(ownerId, dto) {
        const isApprovedAndOwned = await this.vehiclesService.isVehicleApprovedAndOwnedBy(dto.vehicleId, ownerId);
        if (!isApprovedAndOwned) {
            throw new common_1.BadRequestException('Le véhicule doit être approuvé et vous appartenir pour créer une offre');
        }
        const vehicle = await this.vehiclesService.findById(dto.vehicleId);
        if (!vehicle.isForRental) {
            throw new common_1.BadRequestException('Ce véhicule n\'est pas disponible pour la location');
        }
        const existingOffer = await this.prisma.rentalOffer.findUnique({
            where: { vehicleId: dto.vehicleId },
        });
        if (existingOffer) {
            throw new common_1.ConflictException('Une offre existe déjà pour ce véhicule');
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
    async updateOffer(offerId, ownerId, dto) {
        const offer = await this.prisma.rentalOffer.findUnique({
            where: { id: offerId },
            include: { vehicle: true },
        });
        if (!offer) {
            throw new common_1.NotFoundException('Offre non trouvée');
        }
        if (offer.vehicle.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres offres');
        }
        return this.prisma.rentalOffer.update({
            where: { id: offerId },
            data: dto,
            include: {
                vehicle: true,
            },
        });
    }
    async searchOffers(dto) {
        const where = {
            isActive: true,
            vehicle: {
                status: 'APPROVED',
                isActive: true,
            },
        };
        if (dto?.startDate && dto?.endDate) {
            const startDate = new Date(dto.startDate);
            const endDate = new Date(dto.endDate);
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
    async findOfferById(id) {
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
            throw new common_1.NotFoundException('Offre non trouvée');
        }
        return offer;
    }
    async createBookingWithOverlapCheck(offerId, renterId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const offer = await tx.rentalOffer.findUnique({
                where: { id: offerId },
                include: { vehicle: true },
            });
            if (!offer) {
                throw new common_1.NotFoundException('Offre non trouvée');
            }
            if (!offer.isActive) {
                throw new common_1.BadRequestException('Cette offre n\'est plus active');
            }
            if (offer.vehicle.ownerId === renterId) {
                throw new common_1.BadRequestException('Vous ne pouvez pas louer votre propre véhicule');
            }
            const startDate = new Date(dto.startDate);
            const endDate = new Date(dto.endDate);
            if (startDate >= endDate) {
                throw new common_1.BadRequestException('La date de fin doit être après la date de début');
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (startDate < today) {
                throw new common_1.BadRequestException('La date de début ne peut pas être dans le passé');
            }
            const nbDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            if (nbDays < offer.minDays) {
                throw new common_1.BadRequestException(`La durée minimale de location est de ${offer.minDays} jour(s)`);
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
                throw new common_1.ConflictException('Ce véhicule est déjà réservé pour ces dates');
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
    async acceptBooking(bookingId, ownerId) {
        const booking = await this.prisma.rentalBooking.findUnique({
            where: { id: bookingId },
            include: {
                rentalOffer: {
                    include: { vehicle: true },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
        }
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException('Cette réservation ne peut plus être acceptée');
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
    async rejectBooking(bookingId, ownerId) {
        const booking = await this.prisma.rentalBooking.findUnique({
            where: { id: bookingId },
            include: {
                rentalOffer: {
                    include: { vehicle: true },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
        }
        if (booking.status !== 'PENDING') {
            throw new common_1.BadRequestException('Cette réservation ne peut plus être refusée');
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
    async cancelBookingByRenter(bookingId, renterId) {
        const booking = await this.prisma.rentalBooking.findUnique({
            where: { id: bookingId },
            include: {
                rentalOffer: {
                    include: { vehicle: true },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        if (booking.renterId !== renterId) {
            throw new common_1.ForbiddenException('Vous ne pouvez annuler que vos propres réservations');
        }
        if (booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
            throw new common_1.BadRequestException('Cette réservation est déjà annulée ou refusée');
        }
        if (booking.status === 'COMPLETED') {
            throw new common_1.BadRequestException('Cette réservation est déjà terminée');
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
    async getMyBookings(renterId) {
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
    async getMyOffers(ownerId) {
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
    async completeBooking(bookingId, ownerId) {
        const booking = await this.prisma.rentalBooking.findUnique({
            where: { id: bookingId },
            include: {
                rentalOffer: {
                    include: { vehicle: true },
                },
            },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Réservation non trouvée');
        }
        if (booking.rentalOffer.vehicle.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Vous n\'êtes pas le propriétaire de ce véhicule');
        }
        if (booking.status !== 'CONFIRMED') {
            throw new common_1.BadRequestException('Seule une réservation confirmée peut être complétée');
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
};
exports.RentalService = RentalService;
exports.RentalService = RentalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        vehicles_service_1.VehiclesService])
], RentalService);
//# sourceMappingURL=rental.service.js.map