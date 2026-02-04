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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
let VehiclesService = class VehiclesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(ownerId, dto) {
        const existingVehicle = await this.prisma.vehicle.findUnique({
            where: { licensePlate: dto.licensePlate },
        });
        if (existingVehicle) {
            throw new common_1.ConflictException('Un véhicule avec cette plaque existe déjà');
        }
        return this.prisma.vehicle.create({
            data: {
                ...dto,
                ownerId,
            },
            include: {
                photos: true,
                documents: true,
            },
        });
    }
    async findById(id) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
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
                documents: true,
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Véhicule non trouvé');
        }
        return vehicle;
    }
    async findByOwner(ownerId) {
        return this.prisma.vehicle.findMany({
            where: { ownerId },
            include: {
                photos: true,
                documents: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, userId, dto) {
        const vehicle = await this.findById(id);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
        }
        return this.prisma.vehicle.update({
            where: { id },
            data: dto,
            include: {
                photos: true,
                documents: true,
            },
        });
    }
    async addPhoto(vehicleId, userId, dto) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez ajouter des photos qu\'à vos propres véhicules');
        }
        if (dto.isMain) {
            await this.prisma.vehiclePhoto.updateMany({
                where: { vehicleId },
                data: { isMain: false },
            });
        }
        return this.prisma.vehiclePhoto.create({
            data: {
                vehicleId,
                url: dto.url,
                isMain: dto.isMain || false,
            },
        });
    }
    async addDocument(vehicleId, userId, dto) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez ajouter des documents qu\'à vos propres véhicules');
        }
        return this.prisma.vehicleDocument.create({
            data: {
                vehicleId,
                type: dto.type,
                fileUrl: dto.fileUrl,
            },
        });
    }
    async findApprovedById(id) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: {
                id,
                status: 'APPROVED',
            },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Véhicule approuvé non trouvé');
        }
        return vehicle;
    }
    async isVehicleApprovedAndOwnedBy(vehicleId, ownerId) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: {
                id: vehicleId,
                ownerId,
                status: 'APPROVED',
            },
        });
        return !!vehicle;
    }
    async delete(id, userId) {
        const vehicle = await this.findById(id);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres véhicules');
        }
        await this.prisma.vehiclePhoto.deleteMany({ where: { vehicleId: id } });
        await this.prisma.vehicleDocument.deleteMany({ where: { vehicleId: id } });
        return this.prisma.vehicle.delete({ where: { id } });
    }
    async deletePhoto(vehicleId, photoId, userId) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que les photos de vos propres véhicules');
        }
        const photo = await this.prisma.vehiclePhoto.findFirst({
            where: { id: photoId, vehicleId },
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo non trouvée');
        }
        await this.prisma.vehiclePhoto.delete({ where: { id: photoId } });
        if (photo.isMain) {
            const firstPhoto = await this.prisma.vehiclePhoto.findFirst({
                where: { vehicleId },
                orderBy: { createdAt: 'asc' },
            });
            if (firstPhoto) {
                await this.prisma.vehiclePhoto.update({
                    where: { id: firstPhoto.id },
                    data: { isMain: true },
                });
            }
        }
        return { success: true };
    }
    async setMainPhoto(vehicleId, photoId, userId) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
        }
        const photo = await this.prisma.vehiclePhoto.findFirst({
            where: { id: photoId, vehicleId },
        });
        if (!photo) {
            throw new common_1.NotFoundException('Photo non trouvée');
        }
        await this.prisma.vehiclePhoto.updateMany({
            where: { vehicleId },
            data: { isMain: false },
        });
        return this.prisma.vehiclePhoto.update({
            where: { id: photoId },
            data: { isMain: true },
        });
    }
    async deleteDocument(vehicleId, documentId, userId) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez supprimer que les documents de vos propres véhicules');
        }
        const document = await this.prisma.vehicleDocument.findFirst({
            where: { id: documentId, vehicleId },
        });
        if (!document) {
            throw new common_1.NotFoundException('Document non trouvé');
        }
        await this.prisma.vehicleDocument.delete({ where: { id: documentId } });
        return { success: true };
    }
    async toggleActive(vehicleId, userId) {
        const vehicle = await this.findById(vehicleId);
        if (vehicle.ownerId !== userId) {
            throw new common_1.ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
        }
        return this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { isActive: !vehicle.isActive },
            include: {
                photos: true,
                documents: true,
            },
        });
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map