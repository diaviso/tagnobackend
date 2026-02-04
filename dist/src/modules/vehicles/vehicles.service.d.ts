import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { AddDocumentDto } from './dto/add-document.dto';
export declare class VehiclesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(ownerId: string, dto: CreateVehicleDto): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DocumentType;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vehicleId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
    findById(id: string): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        owner: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            photoUrl: string | null;
        };
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DocumentType;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vehicleId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
    findByOwner(ownerId: string): Promise<({
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DocumentType;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vehicleId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    })[]>;
    update(id: string, userId: string, dto: UpdateVehicleDto): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DocumentType;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vehicleId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
    addPhoto(vehicleId: string, userId: string, dto: AddPhotoDto): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string;
        url: string;
        isMain: boolean;
    }>;
    addDocument(vehicleId: string, userId: string, dto: AddDocumentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.DocumentType;
        status: import(".prisma/client").$Enums.DocumentStatus;
        vehicleId: string;
        fileUrl: string;
    }>;
    findApprovedById(id: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
    isVehicleApprovedAndOwnedBy(vehicleId: string, ownerId: string): Promise<boolean>;
    delete(id: string, userId: string): Promise<{
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
    deletePhoto(vehicleId: string, photoId: string, userId: string): Promise<{
        success: boolean;
    }>;
    setMainPhoto(vehicleId: string, photoId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string;
        url: string;
        isMain: boolean;
    }>;
    deleteDocument(vehicleId: string, documentId: string, userId: string): Promise<{
        success: boolean;
    }>;
    toggleActive(vehicleId: string, userId: string): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        documents: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.DocumentType;
            status: import(".prisma/client").$Enums.DocumentStatus;
            vehicleId: string;
            fileUrl: string;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        year: number;
        licensePlate: string;
        ownerId: string;
        brand: string;
        model: string;
        color: string;
        numberOfSeats: number;
        isForRental: boolean;
        isForCarpooling: boolean;
        status: import(".prisma/client").$Enums.VehicleStatus;
        adminComment: string | null;
    }>;
}
