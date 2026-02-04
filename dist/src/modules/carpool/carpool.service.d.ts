import { PrismaService } from '../../common/prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
export declare class CarpoolService {
    private readonly prisma;
    private readonly vehiclesService;
    constructor(prisma: PrismaService, vehiclesService: VehiclesService);
    createTrip(driverId: string, dto: CreateTripDto): Promise<{
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
    searchTrips(dto: SearchTripDto): Promise<({
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
    findTripById(id: string): Promise<{
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
    reserveWithTransaction(tripId: string, passengerId: string, dto: CreateReservationDto): Promise<{
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
    acceptReservation(reservationId: string, driverId: string): Promise<{
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
    rejectReservation(reservationId: string, driverId: string): Promise<{
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
    cancelTrip(tripId: string, driverId: string): Promise<{
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
    cancelReservationByPassenger(reservationId: string, passengerId: string): Promise<{
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
    completeTrip(tripId: string, driverId: string): Promise<{
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
    getMyReservations(passengerId: string): Promise<({
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
    getMyTrips(driverId: string): Promise<({
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
}
