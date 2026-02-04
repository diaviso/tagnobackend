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
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const vehicles_service_1 = require("./vehicles.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("./dto/update-vehicle.dto");
const add_photo_dto_1 = require("./dto/add-photo.dto");
const add_document_dto_1 = require("./dto/add-document.dto");
let VehiclesController = class VehiclesController {
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    async create(user, dto) {
        return this.vehiclesService.create(user.id, dto);
    }
    async findMine(user) {
        return this.vehiclesService.findByOwner(user.id);
    }
    async findOne(id) {
        return this.vehiclesService.findById(id);
    }
    async update(id, user, dto) {
        return this.vehiclesService.update(id, user.id, dto);
    }
    async addPhoto(id, user, dto) {
        return this.vehiclesService.addPhoto(id, user.id, dto);
    }
    async addDocument(id, user, dto) {
        return this.vehiclesService.addDocument(id, user.id, dto);
    }
    async delete(id, user) {
        return this.vehiclesService.delete(id, user.id);
    }
    async deletePhoto(id, photoId, user) {
        return this.vehiclesService.deletePhoto(id, photoId, user.id);
    }
    async setMainPhoto(id, photoId, user) {
        return this.vehiclesService.setMainPhoto(id, photoId, user.id);
    }
    async deleteDocument(id, documentId, user) {
        return this.vehiclesService.deleteDocument(id, documentId, user.id);
    }
    async toggleActive(id, user) {
        return this.vehiclesService.toggleActive(id, user.id);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un nouveau véhicule' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_vehicle_dto_1.CreateVehicleDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer mes véhicules' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer un véhicule par ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_vehicle_dto_1.UpdateVehicleDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter une photo au véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_photo_dto_1.AddPhotoDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "addPhoto", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un document au véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, add_document_dto_1.AddDocumentDto]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "addDocument", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "delete", null);
__decorate([
    (0, common_1.Delete)(':id/photos/:photoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une photo du véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "deletePhoto", null);
__decorate([
    (0, common_1.Patch)(':id/photos/:photoId/main'),
    (0, swagger_1.ApiOperation)({ summary: 'Définir une photo comme principale' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('photoId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "setMainPhoto", null);
__decorate([
    (0, common_1.Delete)(':id/documents/:documentId'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un document du véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('documentId')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Patch)(':id/toggle-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer/désactiver un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "toggleActive", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)('vehicles'),
    (0, common_1.Controller)('vehicles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map