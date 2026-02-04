import { PrismaService } from '../../common/prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchOfferDto } from './dto/search-offer.dto';
export declare class RentalService {
    private readonly prisma;
    private readonly vehiclesService;
    constructor(prisma: PrismaService, vehiclesService: VehiclesService);
    createOffer(ownerId: string, dto: CreateOfferDto): Promise<{
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
    }>;
    updateOffer(offerId: string, ownerId: string, dto: UpdateOfferDto): Promise<{
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
    }>;
    searchOffers(dto?: SearchOfferDto): Promise<({
        vehicle: {
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
    })[]>;
    findOfferById(id: string): Promise<{
        vehicle: {
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
        };
        bookings: {
            id: string;
            status: import(".prisma/client").$Enums.RentalBookingStatus;
            startDate: Date;
            endDate: Date;
        }[];
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: string;
        pricePerDay: number;
        depositAmount: number;
        minDays: number;
    }>;
    createBookingWithOverlapCheck(offerId: string, renterId: string, dto: CreateBookingDto): Promise<{
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
        renter: {
            id: string;
            firstName: string | null;
            lastName: string | null;
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
    }>;
    acceptBooking(bookingId: string, ownerId: string): Promise<{
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
        renter: {
            id: string;
            firstName: string | null;
            lastName: string | null;
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
    }>;
    rejectBooking(bookingId: string, ownerId: string): Promise<{
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
        renter: {
            id: string;
            firstName: string | null;
            lastName: string | null;
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
    }>;
    cancelBookingByRenter(bookingId: string, renterId: string): Promise<{
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
        renter: {
            id: string;
            firstName: string | null;
            lastName: string | null;
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
    }>;
    getMyBookings(renterId: string): Promise<({
        rentalOffer: {
            vehicle: {
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
    })[]>;
    getMyOffers(ownerId: string): Promise<({
        vehicle: {
            id: string;
            licensePlate: string;
            brand: string;
            model: string;
            color: string;
            status: import(".prisma/client").$Enums.VehicleStatus;
        };
        bookings: ({
            renter: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                photoUrl: string | null;
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
    } & {
        id: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: string;
        pricePerDay: number;
        depositAmount: number;
        minDays: number;
    })[]>;
    completeBooking(bookingId: string, ownerId: string): Promise<{
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
        renter: {
            id: string;
            firstName: string | null;
            lastName: string | null;
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
    }>;
}
