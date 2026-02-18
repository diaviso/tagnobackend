import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { AddDocumentDto } from './dto/add-document.dto';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  private async resetStatusIfNeeded(vehicleId: string): Promise<void> {
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId }, select: { status: true } });
    if (vehicle && vehicle.status !== 'PENDING') {
      await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'PENDING', adminComment: null },
      });
    }
  }

  async create(ownerId: string, dto: CreateVehicleDto) {
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { licensePlate: dto.licensePlate },
    });

    if (existingVehicle) {
      throw new ConflictException('Un véhicule avec cette plaque existe déjà');
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

  async findById(id: string) {
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
      throw new NotFoundException('Véhicule non trouvé');
    }

    return vehicle;
  }

  async findByOwner(ownerId: string) {
    return this.prisma.vehicle.findMany({
      where: { ownerId },
      include: {
        photos: true,
        documents: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, userId: string, dto: UpdateVehicleDto) {
    const vehicle = await this.findById(id);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
    }

    await this.resetStatusIfNeeded(id);

    return this.prisma.vehicle.update({
      where: { id },
      data: dto,
      include: {
        photos: true,
        documents: true,
      },
    });
  }

  async addPhoto(vehicleId: string, userId: string, dto: AddPhotoDto) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez ajouter des photos qu\'à vos propres véhicules');
    }

    if (dto.isMain) {
      await this.prisma.vehiclePhoto.updateMany({
        where: { vehicleId },
        data: { isMain: false },
      });
    }

    const photo = await this.prisma.vehiclePhoto.create({
      data: {
        vehicleId,
        url: dto.url,
        isMain: dto.isMain || false,
      },
    });

    await this.resetStatusIfNeeded(vehicleId);

    return photo;
  }

  async addDocument(vehicleId: string, userId: string, dto: AddDocumentDto) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez ajouter des documents qu\'à vos propres véhicules');
    }

    const document = await this.prisma.vehicleDocument.create({
      data: {
        vehicleId,
        type: dto.type,
        fileUrl: dto.fileUrl,
      },
    });

    await this.resetStatusIfNeeded(vehicleId);

    return document;
  }

  async findApprovedById(id: string) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id,
        status: 'APPROVED',
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Véhicule approuvé non trouvé');
    }

    return vehicle;
  }

  async isVehicleApprovedAndOwnedBy(vehicleId: string, ownerId: string): Promise<boolean> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        ownerId,
        status: 'APPROVED',
      },
    });

    return !!vehicle;
  }

  async delete(id: string, userId: string) {
    const vehicle = await this.findById(id);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que vos propres véhicules');
    }

    await this.prisma.vehiclePhoto.deleteMany({ where: { vehicleId: id } });
    await this.prisma.vehicleDocument.deleteMany({ where: { vehicleId: id } });
    
    return this.prisma.vehicle.delete({ where: { id } });
  }

  async deletePhoto(vehicleId: string, photoId: string, userId: string) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que les photos de vos propres véhicules');
    }

    const photo = await this.prisma.vehiclePhoto.findFirst({
      where: { id: photoId, vehicleId },
    });

    if (!photo) {
      throw new NotFoundException('Photo non trouvée');
    }

    await this.prisma.vehiclePhoto.delete({ where: { id: photoId } });
    await this.resetStatusIfNeeded(vehicleId);

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

  async setMainPhoto(vehicleId: string, photoId: string, userId: string) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
    }

    const photo = await this.prisma.vehiclePhoto.findFirst({
      where: { id: photoId, vehicleId },
    });

    if (!photo) {
      throw new NotFoundException('Photo non trouvée');
    }

    await this.prisma.vehiclePhoto.updateMany({
      where: { vehicleId },
      data: { isMain: false },
    });

    await this.prisma.vehiclePhoto.update({
      where: { id: photoId },
      data: { isMain: true },
    });

    await this.resetStatusIfNeeded(vehicleId);

    return this.findById(vehicleId);
  }

  async deleteDocument(vehicleId: string, documentId: string, userId: string) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que les documents de vos propres véhicules');
    }

    const document = await this.prisma.vehicleDocument.findFirst({
      where: { id: documentId, vehicleId },
    });

    if (!document) {
      throw new NotFoundException('Document non trouvé');
    }

    await this.prisma.vehicleDocument.delete({ where: { id: documentId } });
    await this.resetStatusIfNeeded(vehicleId);

    return { success: true };
  }

  async toggleActive(vehicleId: string, userId: string) {
    const vehicle = await this.findById(vehicleId);

    if (vehicle.ownerId !== userId) {
      throw new ForbiddenException('Vous ne pouvez modifier que vos propres véhicules');
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
}
