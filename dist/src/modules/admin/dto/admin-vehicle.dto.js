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
exports.UpdateUserRoleDto = exports.AdminUserQueryDto = exports.RejectVehicleDto = exports.AdminVehicleQueryDto = exports.UserRole = exports.VehicleStatus = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var VehicleStatus;
(function (VehicleStatus) {
    VehicleStatus["PENDING"] = "PENDING";
    VehicleStatus["APPROVED"] = "APPROVED";
    VehicleStatus["REJECTED"] = "REJECTED";
})(VehicleStatus || (exports.VehicleStatus = VehicleStatus = {}));
var UserRole;
(function (UserRole) {
    UserRole["USER"] = "USER";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
class AdminVehicleQueryDto {
}
exports.AdminVehicleQueryDto = AdminVehicleQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: VehicleStatus, required: false }),
    (0, class_validator_1.IsEnum)(VehicleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminVehicleQueryDto.prototype, "status", void 0);
class RejectVehicleDto {
}
exports.RejectVehicleDto = RejectVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Documents incomplets', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RejectVehicleDto.prototype, "comment", void 0);
class AdminUserQueryDto {
}
exports.AdminUserQueryDto = AdminUserQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, description: 'Recherche par email, nom ou prénom' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminUserQueryDto.prototype, "search", void 0);
class UpdateUserRoleDto {
}
exports.UpdateUserRoleDto = UpdateUserRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: UserRole, example: UserRole.USER }),
    (0, class_validator_1.IsEnum)(UserRole),
    __metadata("design:type", String)
], UpdateUserRoleDto.prototype, "role", void 0);
//# sourceMappingURL=admin-vehicle.dto.js.map