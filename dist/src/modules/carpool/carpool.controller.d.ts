import { CarpoolService } from './carpool.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
export declare class CarpoolController {
    private readonly carpoolService;
    constructor(carpoolService: CarpoolService);
    createTrip(user: any, dto: CreateTripDto): Promise<{
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
        driver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            photoUrl: string | null;
        };
    } & {
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
    }>;
    getMyTrips(user: any): Promise<({
        vehicle: {
            id: string;
            licensePlate: string;
            brand: string;
            model: string;
            color: string;
        };
        reservations: ({
            passenger: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                photoUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolReservationStatus;
            seatsReserved: number;
            tripId: string;
            passengerId: string;
        })[];
    } & {
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
    })[]>;
    searchTrips(query: SearchTripDto): Promise<({
        vehicle: {
            id: string;
            brand: string;
            model: string;
            color: string;
        };
        driver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            photoUrl: string | null;
        };
    } & {
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
    })[]>;
    findTrip(id: string): Promise<{
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
        driver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
            photoUrl: string | null;
        };
        reservations: ({
            passenger: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                photoUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolReservationStatus;
            seatsReserved: number;
            tripId: string;
            passengerId: string;
        })[];
    } & {
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
    }>;
    createReservation(tripId: string, user: any, dto: CreateReservationDto): Promise<{
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
        passenger: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.CarpoolReservationStatus;
        seatsReserved: number;
        tripId: string;
        passengerId: string;
    }>;
    acceptReservation(reservationId: string, user: any): Promise<{
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
        passenger: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.CarpoolReservationStatus;
        seatsReserved: number;
        tripId: string;
        passengerId: string;
    }>;
    rejectReservation(reservationId: string, user: any): Promise<{
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
        passenger: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.CarpoolReservationStatus;
        seatsReserved: number;
        tripId: string;
        passengerId: string;
    }>;
    cancelReservation(reservationId: string, user: any): Promise<{
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
        passenger: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.CarpoolReservationStatus;
        seatsReserved: number;
        tripId: string;
        passengerId: string;
    }>;
    getMyReservations(user: any): Promise<({
        trip: {
            vehicle: {
                id: string;
                brand: string;
                model: string;
                color: string;
            };
            driver: {
                id: string;
                firstName: string | null;
                lastName: string | null;
                photoUrl: string | null;
            };
        } & {
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
    })[]>;
    cancelTrip(tripId: string, user: any): Promise<{
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
        driver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
    } & {
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
    }>;
    completeTrip(tripId: string, user: any): Promise<{
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
        driver: {
            id: string;
            firstName: string | null;
            lastName: string | null;
        };
        reservations: ({
            passenger: {
                id: string;
                firstName: string | null;
                lastName: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.CarpoolReservationStatus;
            seatsReserved: number;
            tripId: string;
            passengerId: string;
        })[];
    } & {
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
    }>;
}
