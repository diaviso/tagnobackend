import { PrismaService } from '../../common/prisma/prisma.service';
import { VehicleStatus } from './dto/admin-vehicle.dto';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatistics(): Promise<{
        users: {
            total: number;
        };
        vehicles: {
            total: number;
            pending: number;
            approved: number;
            rejected: number;
        };
        carpool: {
            totalTrips: number;
            openTrips: number;
            completedTrips: number;
            totalReservations: number;
        };
        rental: {
            totalOffers: number;
            activeOffers: number;
            totalBookings: number;
        };
        recentVehicles: ({
            owner: {
                firstName: string | null;
                lastName: string | null;
            };
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
        })[];
        recentUsers: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            createdAt: Date;
        }[];
    }>;
    findVehicles(status?: VehicleStatus): Promise<({
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        owner: {
            id: string;
            email: string;
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
    })[]>;
    getVehicleById(id: string): Promise<{
        rentalOffer: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            vehicleId: string;
            pricePerDay: number;
            depositAmount: number;
            minDays: number;
        } | null;
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
            photoUrl: string | null;
            createdAt: Date;
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
        carpoolTrips: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolTripStatus;
            vehicleId: string;
            departureCity: string;
            arrivalCity: string;
            departureTime: Date;
            pricePerSeat: number;
            availableSeats: number;
            driverId: string;
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
    approveVehicle(id: string): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
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
    rejectVehicle(id: string, comment?: string): Promise<{
        photos: {
            id: string;
            createdAt: Date;
            vehicleId: string;
            url: string;
            isMain: boolean;
        }[];
        owner: {
            id: string;
            email: string;
            firstName: string | null;
            lastName: string | null;
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
    findUsers(search?: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        photoUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        _count: {
            vehicles: number;
            carpoolTripsAsDriver: number;
            carpoolReservations: number;
            rentalBookings: number;
        };
    }[]>;
    getUserById(id: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        photoUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        vehicles: ({
            photos: {
                id: string;
                createdAt: Date;
                vehicleId: string;
                url: string;
                isMain: boolean;
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
        })[];
        carpoolTripsAsDriver: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolTripStatus;
            vehicleId: string;
            departureCity: string;
            arrivalCity: string;
            departureTime: Date;
            pricePerSeat: number;
            availableSeats: number;
            driverId: string;
        }[];
        carpoolReservations: ({
            trip: {
                id: string;
                createdAt: Date;
                status: import(".prisma/client").$Enums.CarpoolTripStatus;
                vehicleId: string;
                departureCity: string;
                arrivalCity: string;
                departureTime: Date;
                pricePerSeat: number;
                availableSeats: number;
                driverId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolReservationStatus;
            seatsReserved: number;
            tripId: string;
            passengerId: string;
        })[];
        rentalBookings: ({
            rentalOffer: {
                vehicle: {
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
                };
            } & {
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                vehicleId: string;
                pricePerDay: number;
                depositAmount: number;
                minDays: number;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.RentalBookingStatus;
            startDate: Date;
            endDate: Date;
            rentalOfferId: string;
            renterId: string;
            totalPrice: number;
        })[];
    }>;
    updateUserRole(id: string, role: 'USER' | 'ADMIN'): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
    toggleUserActive(id: string): Promise<{
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
    }>;
}
