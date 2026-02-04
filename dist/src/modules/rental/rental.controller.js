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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const rental_service_1 = require("./rental.service");
const create_offer_dto_1 = require("./dto/create-offer.dto");
const update_offer_dto_1 = require("./dto/update-offer.dto");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const search_offer_dto_1 = require("./dto/search-offer.dto");
let RentalController = class RentalController {
    constructor(rentalService) {
        this.rentalService = rentalService;
    }
    async createOffer(user, dto) {
        return this.rentalService.createOffer(user.id, dto);
    }
    async updateOffer(id, user, dto) {
        return this.rentalService.updateOffer(id, user.id, dto);
    }
    async getMyOffers(user) {
        return this.rentalService.getMyOffers(user.id);
    }
    async searchOffers(query) {
        return this.rentalService.searchOffers(query);
    }
    async findOffer(id) {
        return this.rentalService.findOfferById(id);
    }
    async createBooking(offerId, user, dto) {
        return this.rentalService.createBookingWithOverlapCheck(offerId, user.id, dto);
    }
    async acceptBooking(bookingId, user) {
        return this.rentalService.acceptBooking(bookingId, user.id);
    }
    async rejectBooking(bookingId, user) {
        return this.rentalService.rejectBooking(bookingId, user.id);
    }
    async cancelBooking(bookingId, user) {
        return this.rentalService.cancelBookingByRenter(bookingId, user.id);
    }
    async completeBooking(bookingId, user) {
        return this.rentalService.completeBooking(bookingId, user.id);
    }
    async getMyBookings(user) {
        return this.rentalService.getMyBookings(user.id);
    }
};
exports.RentalController = RentalController;
__decorate([
    (0, common_1.Post)('offers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une offre de location' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_offer_dto_1.CreateOfferDto]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "createOffer", null);
__decorate([
    (0, common_1.Patch)('offers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier une offre de location' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_offer_dto_1.UpdateOfferDto]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "updateOffer", null);
__decorate([
    (0, common_1.Get)('offers/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes offres de location' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "getMyOffers", null);
__decorate([
    (0, common_1.Get)('offers/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher des offres de location disponibles' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_offer_dto_1.SearchOfferDto]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "searchOffers", null);
__decorate([
    (0, common_1.Get)('offers/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer une offre par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "findOffer", null);
__decorate([
    (0, common_1.Post)('offers/:id/bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une réservation de location' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accepter une réservation (propriétaire)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "acceptBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Refuser une réservation (propriétaire)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler ma réservation (locataire)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "cancelBooking", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer une location comme terminée (propriétaire)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "completeBooking", null);
__decorate([
    (0, common_1.Get)('bookings/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes réservations de location' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RentalController.prototype, "getMyBookings", null);
exports.RentalController = RentalController = __decorate([
    (0, swagger_1.ApiTags)('rental'),
    (0, common_1.Controller)('rental'),
    __metadata("design:paramtypes", [rental_service_1.RentalService])
], RentalController);
//# sourceMappingURL=rental.controller.js.map