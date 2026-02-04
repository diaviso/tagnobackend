import { RentalService } from './rental.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchOfferDto } from './dto/search-offer.dto';
export declare class RentalController {
    private readonly rentalService;
    constructor(rentalService: RentalService);
    createOffer(user: any, dto: CreateOfferDto): Promise<{
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
    updateOffer(id: string, user: any, dto: UpdateOfferDto): Promise<{
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
    getMyOffers(user: any): Promise<({
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
    searchOffers(query: SearchOfferDto): Promise<({
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
    findOffer(id: string): Promise<{
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
    createBooking(offerId: string, user: any, dto: CreateBookingDto): Promise<{
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
    acceptBooking(bookingId: string, user: any): Promise<{
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
    rejectBooking(bookingId: string, user: any): Promise<{
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
    cancelBooking(bookingId: string, user: any): Promise<{
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
    completeBooking(bookingId: string, user: any): Promise<{
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
    getMyBookings(user: any): Promise<({
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
}
