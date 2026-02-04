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
exports.CarpoolController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const carpool_service_1 = require("./carpool.service");
const create_trip_dto_1 = require("./dto/create-trip.dto");
const search_trip_dto_1 = require("./dto/search-trip.dto");
const create_reservation_dto_1 = require("./dto/create-reservation.dto");
let CarpoolController = class CarpoolController {
    constructor(carpoolService) {
        this.carpoolService = carpoolService;
    }
    async createTrip(user, dto) {
        return this.carpoolService.createTrip(user.id, dto);
    }
    async getMyTrips(user) {
        return this.carpoolService.getMyTrips(user.id);
    }
    async searchTrips(query) {
        return this.carpoolService.searchTrips(query);
    }
    async findTrip(id) {
        return this.carpoolService.findTripById(id);
    }
    async createReservation(tripId, user, dto) {
        return this.carpoolService.reserveWithTransaction(tripId, user.id, dto);
    }
    async acceptReservation(reservationId, user) {
        return this.carpoolService.acceptReservation(reservationId, user.id);
    }
    async rejectReservation(reservationId, user) {
        return this.carpoolService.rejectReservation(reservationId, user.id);
    }
    async cancelReservation(reservationId, user) {
        return this.carpoolService.cancelReservationByPassenger(reservationId, user.id);
    }
    async getMyReservations(user) {
        return this.carpoolService.getMyReservations(user.id);
    }
    async cancelTrip(tripId, user) {
        return this.carpoolService.cancelTrip(tripId, user.id);
    }
    async completeTrip(tripId, user) {
        return this.carpoolService.completeTrip(tripId, user.id);
    }
};
exports.CarpoolController = CarpoolController;
__decorate([
    (0, common_1.Post)('trips'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau trajet de covoiturage' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_trip_dto_1.CreateTripDto]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "createTrip", null);
__decorate([
    (0, common_1.Get)('trips/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes trajets en tant que conducteur' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "getMyTrips", null);
__decorate([
    (0, common_1.Get)('trips/search'),
    (0, swagger_1.ApiOperation)({ summary: 'Rechercher des trajets disponibles' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_trip_dto_1.SearchTripDto]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "searchTrips", null);
__decorate([
    (0, common_1.Get)('trips/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un trajet par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "findTrip", null);
__decorate([
    (0, common_1.Post)('trips/:id/reservations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Réserver des places sur un trajet' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_reservation_dto_1.CreateReservationDto]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "createReservation", null);
__decorate([
    (0, common_1.Patch)('reservations/:id/accept'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Accepter une réservation (conducteur)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "acceptReservation", null);
__decorate([
    (0, common_1.Patch)('reservations/:id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Refuser une réservation (conducteur)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "rejectReservation", null);
__decorate([
    (0, common_1.Patch)('reservations/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler ma réservation (passager)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "cancelReservation", null);
__decorate([
    (0, common_1.Get)('reservations/mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes réservations en tant que passager' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "getMyReservations", null);
__decorate([
    (0, common_1.Patch)('trips/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Annuler un trajet (conducteur)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "cancelTrip", null);
__decorate([
    (0, common_1.Patch)('trips/:id/complete'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Marquer un trajet comme complété (conducteur)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CarpoolController.prototype, "completeTrip", null);
exports.CarpoolController = CarpoolController = __decorate([
    (0, swagger_1.ApiTags)('carpool'),
    (0, common_1.Controller)('carpool'),
    __metadata("design:paramtypes", [carpool_service_1.CarpoolService])
], CarpoolController);
//# sourceMappingURL=carpool.controller.js.map