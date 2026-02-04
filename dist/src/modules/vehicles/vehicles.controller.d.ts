import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { AddDocumentDto } from './dto/add-document.dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(user: any, dto: CreateVehicleDto): Promise<{
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
    findMine(user: any): Promise<({
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
    findOne(id: string): Promise<{
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
    update(id: string, user: any, dto: UpdateVehicleDto): Promise<{
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
    addPhoto(id: string, user: any, dto: AddPhotoDto): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string;
        url: string;
        isMain: boolean;
    }>;
    addDocument(id: string, user: any, dto: AddDocumentDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.DocumentType;
        status: import(".prisma/client").$Enums.DocumentStatus;
        vehicleId: string;
        fileUrl: string;
    }>;
    delete(id: string, user: any): Promise<{
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
    deletePhoto(id: string, photoId: string, user: any): Promise<{
        success: boolean;
    }>;
    setMainPhoto(id: string, photoId: string, user: any): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string;
        url: string;
        isMain: boolean;
    }>;
    deleteDocument(id: string, documentId: string, user: any): Promise<{
        success: boolean;
    }>;
    toggleActive(id: string, user: any): Promise<{
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
