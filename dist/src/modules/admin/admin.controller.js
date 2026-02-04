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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const admin_service_1 = require("./admin.service");
const admin_vehicle_dto_1 = require("./dto/admin-vehicle.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getStatistics() {
        return this.adminService.getStatistics();
    }
    async findVehicles(query) {
        return this.adminService.findVehicles(query.status);
    }
    async getVehicleById(id) {
        return this.adminService.getVehicleById(id);
    }
    async approveVehicle(id) {
        return this.adminService.approveVehicle(id);
    }
    async rejectVehicle(id, dto) {
        return this.adminService.rejectVehicle(id, dto.comment);
    }
    async findUsers(query) {
        return this.adminService.findUsers(query.search);
    }
    async getUserById(id) {
        return this.adminService.getUserById(id);
    }
    async updateUserRole(id, dto) {
        return this.adminService.updateUserRole(id, dto.role);
    }
    async toggleUserActive(id) {
        return this.adminService.toggleUserActive(id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les statistiques globales' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStatistics", null);
__decorate([
    (0, common_1.Get)('vehicles'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les véhicules (filtrable par status)' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_vehicle_dto_1.AdminVehicleQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findVehicles", null);
__decorate([
    (0, common_1.Get)('vehicles/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getVehicleById", null);
__decorate([
    (0, common_1.Patch)('vehicles/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approuver un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveVehicle", null);
__decorate([
    (0, common_1.Patch)('vehicles/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Rejeter un véhicule' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_vehicle_dto_1.RejectVehicleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectVehicle", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Lister les utilisateurs' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_vehicle_dto_1.AdminUserQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findUsers", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtenir les détails d\'un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Patch)('users/:id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Modifier le rôle d\'un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_vehicle_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUserRole", null);
__decorate([
    (0, common_1.Patch)('users/:id/toggle-active'),
    (0, swagger_1.ApiOperation)({ summary: 'Activer/désactiver un utilisateur' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleUserActive", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map