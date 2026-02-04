-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('INSURANCE', 'REGISTRATION', 'TECHNICAL_VISIT');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CarpoolTripStatus" AS ENUM ('OPEN', 'FULL', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "CarpoolReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "RentalBookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "photoUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "isForRental" BOOLEAN NOT NULL DEFAULT false,
    "isForCarpooling" BOOLEAN NOT NULL DEFAULT false,
    "status" "VehicleStatus" NOT NULL DEFAULT 'PENDING',
    "adminComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehiclePhoto" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehiclePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleDocument" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarpoolTrip" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "departureCity" TEXT NOT NULL,
    "arrivalCity" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "pricePerSeat" INTEGER NOT NULL,
    "availableSeats" INTEGER NOT NULL,
    "status" "CarpoolTripStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarpoolTrip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarpoolReservation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "passengerId" TEXT NOT NULL,
    "seatsReserved" INTEGER NOT NULL,
    "status" "CarpoolReservationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarpoolReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalOffer" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "depositAmount" INTEGER NOT NULL,
    "minDays" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RentalOffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RentalBooking" (
    "id" TEXT NOT NULL,
    "rentalOfferId" TEXT NOT NULL,
    "renterId" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "RentalBookingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RentalBooking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_googleId_idx" ON "User"("googleId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_licensePlate_key" ON "Vehicle"("licensePlate");

-- CreateIndex
CREATE INDEX "Vehicle_ownerId_idx" ON "Vehicle"("ownerId");

-- CreateIndex
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");

-- CreateIndex
CREATE INDEX "Vehicle_isForRental_idx" ON "Vehicle"("isForRental");

-- CreateIndex
CREATE INDEX "Vehicle_isForCarpooling_idx" ON "Vehicle"("isForCarpooling");

-- CreateIndex
CREATE INDEX "VehiclePhoto_vehicleId_idx" ON "VehiclePhoto"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleDocument_vehicleId_idx" ON "VehicleDocument"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleDocument_status_idx" ON "VehicleDocument"("status");

-- CreateIndex
CREATE INDEX "CarpoolTrip_driverId_idx" ON "CarpoolTrip"("driverId");

-- CreateIndex
CREATE INDEX "CarpoolTrip_vehicleId_idx" ON "CarpoolTrip"("vehicleId");

-- CreateIndex
CREATE INDEX "CarpoolTrip_departureCity_idx" ON "CarpoolTrip"("departureCity");

-- CreateIndex
CREATE INDEX "CarpoolTrip_arrivalCity_idx" ON "CarpoolTrip"("arrivalCity");

-- CreateIndex
CREATE INDEX "CarpoolTrip_departureTime_idx" ON "CarpoolTrip"("departureTime");

-- CreateIndex
CREATE INDEX "CarpoolTrip_status_idx" ON "CarpoolTrip"("status");

-- CreateIndex
CREATE INDEX "CarpoolReservation_tripId_idx" ON "CarpoolReservation"("tripId");

-- CreateIndex
CREATE INDEX "CarpoolReservation_passengerId_idx" ON "CarpoolReservation"("passengerId");

-- CreateIndex
CREATE INDEX "CarpoolReservation_status_idx" ON "CarpoolReservation"("status");

-- CreateIndex
CREATE UNIQUE INDEX "RentalOffer_vehicleId_key" ON "RentalOffer"("vehicleId");

-- CreateIndex
CREATE INDEX "RentalOffer_isActive_idx" ON "RentalOffer"("isActive");

-- CreateIndex
CREATE INDEX "RentalOffer_pricePerDay_idx" ON "RentalOffer"("pricePerDay");

-- CreateIndex
CREATE INDEX "RentalBooking_rentalOfferId_idx" ON "RentalBooking"("rentalOfferId");

-- CreateIndex
CREATE INDEX "RentalBooking_renterId_idx" ON "RentalBooking"("renterId");

-- CreateIndex
CREATE INDEX "RentalBooking_status_idx" ON "RentalBooking"("status");

-- CreateIndex
CREATE INDEX "RentalBooking_startDate_endDate_idx" ON "RentalBooking"("startDate", "endDate");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehiclePhoto" ADD CONSTRAINT "VehiclePhoto_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleDocument" ADD CONSTRAINT "VehicleDocument_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolTrip" ADD CONSTRAINT "CarpoolTrip_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolTrip" ADD CONSTRAINT "CarpoolTrip_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolReservation" ADD CONSTRAINT "CarpoolReservation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "CarpoolTrip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarpoolReservation" ADD CONSTRAINT "CarpoolReservation_passengerId_fkey" FOREIGN KEY ("passengerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalOffer" ADD CONSTRAINT "RentalOffer_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalBooking" ADD CONSTRAINT "RentalBooking_rentalOfferId_fkey" FOREIGN KEY ("rentalOfferId") REFERENCES "RentalOffer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalBooking" ADD CONSTRAINT "RentalBooking_renterId_fkey" FOREIGN KEY ("renterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
