import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

// IDs des utilisateurs existants
const ADMIN_ID = '99c95827-4bae-4c6f-9e47-7a0782eb37d5';
const USER1_ID = 'ab389909-fe00-4809-8865-1f1367a03a14';
const USER2_ID = 'dba44074-ff7f-48f2-b4f9-b97d26f8a58b';

async function main() {
  console.log('🌱 Seeding database with test data...');

  // Créer les utilisateurs de test
  await prisma.user.upsert({
    where: { id: ADMIN_ID },
    update: { role: 'ADMIN' },
    create: {
      id: ADMIN_ID,
      email: 'admin@taagno.com',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm2Pro/V9jCKbSzmlCXO', // password123
      firstName: 'Admin',
      lastName: 'Taagno',
      role: 'ADMIN',
      emailVerified: true,
      userMode: 'VOYAGEUR',
    },
  });

  await prisma.user.upsert({
    where: { id: USER1_ID },
    update: {},
    create: {
      id: USER1_ID,
      email: 'user1@taagno.com',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm2Pro/V9jCKbSzmlCXO', // password123
      firstName: 'Amadou',
      lastName: 'Diallo',
      role: 'USER',
      emailVerified: true,
      userMode: 'PROPRIETAIRE',
    },
  });

  await prisma.user.upsert({
    where: { id: USER2_ID },
    update: {},
    create: {
      id: USER2_ID,
      email: 'user2@taagno.com',
      password: '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36PQm2Pro/V9jCKbSzmlCXO', // password123
      firstName: 'Fatou',
      lastName: 'Ndiaye',
      role: 'USER',
      emailVerified: true,
      userMode: 'PROPRIETAIRE',
    },
  });

  console.log('✅ Users created (admin + 2 users)');

  // ============== VÉHICULES USER 1 ==============
  console.log('\n📦 Creating vehicles for User 1...');

  const vehicle1 = await prisma.vehicle.upsert({
    where: { licensePlate: 'DK-1234-AA' },
    update: {},
    create: {
      ownerId: USER1_ID,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      color: 'Blanc',
      licensePlate: 'DK-1234-AA',
      numberOfSeats: 5,
      isForRental: false,
      isForCarpooling: true,
      status: 'APPROVED',
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { licensePlate: 'DK-5678-BB' },
    update: {},
    create: {
      ownerId: USER1_ID,
      brand: 'Peugeot',
      model: '308',
      year: 2021,
      color: 'Gris',
      licensePlate: 'DK-5678-BB',
      numberOfSeats: 5,
      isForRental: true,
      isForCarpooling: true,
      status: 'APPROVED',
    },
  });

  const vehicle3 = await prisma.vehicle.upsert({
    where: { licensePlate: 'DK-9012-CC' },
    update: {},
    create: {
      ownerId: USER1_ID,
      brand: 'Mercedes',
      model: 'Classe C',
      year: 2023,
      color: 'Noir',
      licensePlate: 'DK-9012-CC',
      numberOfSeats: 5,
      isForRental: true,
      isForCarpooling: false,
      status: 'PENDING',
    },
  });

  console.log('✅ Vehicles for User 1 created');

  // ============== VÉHICULES USER 2 ==============
  console.log('\n📦 Creating vehicles for User 2...');

  const vehicle4 = await prisma.vehicle.upsert({
    where: { licensePlate: 'SL-1111-DD' },
    update: {},
    create: {
      ownerId: USER2_ID,
      brand: 'Renault',
      model: 'Duster',
      year: 2020,
      color: 'Rouge',
      licensePlate: 'SL-1111-DD',
      numberOfSeats: 5,
      isForRental: true,
      isForCarpooling: true,
      status: 'APPROVED',
    },
  });

  const vehicle5 = await prisma.vehicle.upsert({
    where: { licensePlate: 'SL-2222-EE' },
    update: {},
    create: {
      ownerId: USER2_ID,
      brand: 'Hyundai',
      model: 'Tucson',
      year: 2022,
      color: 'Bleu',
      licensePlate: 'SL-2222-EE',
      numberOfSeats: 5,
      isForRental: false,
      isForCarpooling: true,
      status: 'APPROVED',
    },
  });

  const vehicle6 = await prisma.vehicle.upsert({
    where: { licensePlate: 'SL-3333-FF' },
    update: {},
    create: {
      ownerId: USER2_ID,
      brand: 'Ford',
      model: 'Transit',
      year: 2019,
      color: 'Blanc',
      licensePlate: 'SL-3333-FF',
      numberOfSeats: 9,
      isForRental: true,
      isForCarpooling: true,
      status: 'APPROVED',
    },
  });

  const vehicle7 = await prisma.vehicle.upsert({
    where: { licensePlate: 'SL-4444-GG' },
    update: {},
    create: {
      ownerId: USER2_ID,
      brand: 'Kia',
      model: 'Sportage',
      year: 2021,
      color: 'Vert',
      licensePlate: 'SL-4444-GG',
      numberOfSeats: 5,
      isForRental: true,
      isForCarpooling: false,
      status: 'REJECTED',
      adminComment: 'Documents incomplets. Veuillez fournir l\'assurance valide.',
    },
  });

  console.log('✅ Vehicles for User 2 created');

  // ============== PHOTOS DES VÉHICULES ==============
  console.log('\n📸 Adding vehicle photos...');

  const vehiclePhotos = [
    { vehicleId: vehicle1.id, url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', isMain: true },
    { vehicleId: vehicle1.id, url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', isMain: false },
    { vehicleId: vehicle2.id, url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', isMain: true },
    { vehicleId: vehicle2.id, url: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800', isMain: false },
    { vehicleId: vehicle4.id, url: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800', isMain: true },
    { vehicleId: vehicle4.id, url: 'https://images.unsplash.com/photo-1619976215249-0b6c3e3e8a36?w=800', isMain: false },
    { vehicleId: vehicle5.id, url: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', isMain: true },
    { vehicleId: vehicle6.id, url: 'https://images.unsplash.com/photo-1570733577524-3a047079e80d?w=800', isMain: true },
  ];

  for (const photo of vehiclePhotos) {
    await prisma.vehiclePhoto.create({ data: photo });
  }
  console.log('✅ Vehicle photos added');

  // ============== DOCUMENTS DES VÉHICULES ==============
  console.log('\n📄 Adding vehicle documents...');

  const vehicleDocuments = [
    { vehicleId: vehicle1.id, type: 'INSURANCE' as const, fileUrl: 'https://example.com/docs/insurance1.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle1.id, type: 'REGISTRATION' as const, fileUrl: 'https://example.com/docs/registration1.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle1.id, type: 'TECHNICAL_VISIT' as const, fileUrl: 'https://example.com/docs/technical1.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle2.id, type: 'INSURANCE' as const, fileUrl: 'https://example.com/docs/insurance2.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle2.id, type: 'REGISTRATION' as const, fileUrl: 'https://example.com/docs/registration2.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle4.id, type: 'INSURANCE' as const, fileUrl: 'https://example.com/docs/insurance4.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle4.id, type: 'REGISTRATION' as const, fileUrl: 'https://example.com/docs/registration4.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle4.id, type: 'TECHNICAL_VISIT' as const, fileUrl: 'https://example.com/docs/technical4.pdf', status: 'PENDING' as const },
    { vehicleId: vehicle5.id, type: 'INSURANCE' as const, fileUrl: 'https://example.com/docs/insurance5.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle6.id, type: 'INSURANCE' as const, fileUrl: 'https://example.com/docs/insurance6.pdf', status: 'APPROVED' as const },
    { vehicleId: vehicle6.id, type: 'REGISTRATION' as const, fileUrl: 'https://example.com/docs/registration6.pdf', status: 'APPROVED' as const },
  ];

  for (const doc of vehicleDocuments) {
    await prisma.vehicleDocument.create({ data: doc });
  }
  console.log('✅ Vehicle documents added');

  // ============== TRAJETS COVOITURAGE ==============
  console.log('\n🚗 Creating carpool trips...');

  const now = new Date();
  const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);

  // Trajets User 1
  const trip1 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: USER1_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Thiès',
      departureTime: addHours(5),
      pricePerSeat: 2500,
      availableSeats: 3,
      status: 'OPEN',
    },
  });

  const trip2 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: USER1_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Saint-Louis',
      departureTime: addDays(1),
      pricePerSeat: 5000,
      availableSeats: 4,
      status: 'OPEN',
    },
  });

  const trip3 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle2.id,
      driverId: USER1_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Mbour',
      departureTime: addDays(2),
      pricePerSeat: 3000,
      availableSeats: 3,
      status: 'OPEN',
    },
  });

  const trip4 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: USER1_ID,
      departureCity: 'Thiès',
      arrivalCity: 'Dakar',
      departureTime: addDays(3),
      pricePerSeat: 2500,
      availableSeats: 2,
      status: 'OPEN',
    },
  });

  // Trajets User 2
  const trip5 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle4.id,
      driverId: USER2_ID,
      departureCity: 'Saint-Louis',
      arrivalCity: 'Dakar',
      departureTime: addHours(8),
      pricePerSeat: 5000,
      availableSeats: 4,
      status: 'OPEN',
    },
  });

  const trip6 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle5.id,
      driverId: USER2_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Touba',
      departureTime: addDays(1),
      pricePerSeat: 4000,
      availableSeats: 3,
      status: 'OPEN',
    },
  });

  const trip7 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle6.id,
      driverId: USER2_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Ziguinchor',
      departureTime: addDays(4),
      pricePerSeat: 10000,
      availableSeats: 8,
      status: 'OPEN',
    },
  });

  const trip8 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle4.id,
      driverId: USER2_ID,
      departureCity: 'Kaolack',
      arrivalCity: 'Dakar',
      departureTime: addDays(2),
      pricePerSeat: 4500,
      availableSeats: 4,
      status: 'OPEN',
    },
  });

  const trip9 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle5.id,
      driverId: USER2_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Tambacounda',
      departureTime: addDays(5),
      pricePerSeat: 8000,
      availableSeats: 4,
      status: 'OPEN',
    },
  });

  // Trajets passés (complétés)
  const tripPast1 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle1.id,
      driverId: USER1_ID,
      departureCity: 'Dakar',
      arrivalCity: 'Thiès',
      departureTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      pricePerSeat: 2500,
      availableSeats: 0,
      status: 'COMPLETED',
    },
  });

  const tripPast2 = await prisma.carpoolTrip.create({
    data: {
      vehicleId: vehicle4.id,
      driverId: USER2_ID,
      departureCity: 'Saint-Louis',
      arrivalCity: 'Dakar',
      departureTime: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      pricePerSeat: 5000,
      availableSeats: 1,
      status: 'COMPLETED',
    },
  });

  console.log('✅ Carpool trips created');

  // ============== RÉSERVATIONS COVOITURAGE ==============
  console.log('\n🎫 Creating carpool reservations...');

  // User2 réserve chez User1
  await prisma.carpoolReservation.create({
    data: {
      tripId: trip1.id,
      passengerId: USER2_ID,
      seatsReserved: 2,
      status: 'CONFIRMED',
    },
  });

  await prisma.carpoolReservation.create({
    data: {
      tripId: trip2.id,
      passengerId: USER2_ID,
      seatsReserved: 1,
      status: 'PENDING',
    },
  });

  // User1 réserve chez User2
  await prisma.carpoolReservation.create({
    data: {
      tripId: trip5.id,
      passengerId: USER1_ID,
      seatsReserved: 2,
      status: 'CONFIRMED',
    },
  });

  await prisma.carpoolReservation.create({
    data: {
      tripId: trip7.id,
      passengerId: USER1_ID,
      seatsReserved: 3,
      status: 'PENDING',
    },
  });

  // Admin réserve aussi
  await prisma.carpoolReservation.create({
    data: {
      tripId: trip6.id,
      passengerId: ADMIN_ID,
      seatsReserved: 1,
      status: 'CONFIRMED',
    },
  });

  // Réservations passées
  await prisma.carpoolReservation.create({
    data: {
      tripId: tripPast1.id,
      passengerId: USER2_ID,
      seatsReserved: 2,
      status: 'COMPLETED',
    },
  });

  await prisma.carpoolReservation.create({
    data: {
      tripId: tripPast2.id,
      passengerId: USER1_ID,
      seatsReserved: 1,
      status: 'COMPLETED',
    },
  });

  console.log('✅ Carpool reservations created');

  // ============== OFFRES DE LOCATION ==============
  console.log('\n🏠 Creating rental offers...');

  const offer1 = await prisma.rentalOffer.create({
    data: {
      vehicleId: vehicle2.id,
      pricePerDay: 25000,
      depositAmount: 100000,
      minDays: 1,
      isActive: true,
    },
  });

  const offer2 = await prisma.rentalOffer.create({
    data: {
      vehicleId: vehicle4.id,
      pricePerDay: 30000,
      depositAmount: 150000,
      minDays: 2,
      isActive: true,
    },
  });

  const offer3 = await prisma.rentalOffer.create({
    data: {
      vehicleId: vehicle6.id,
      pricePerDay: 50000,
      depositAmount: 200000,
      minDays: 3,
      isActive: true,
    },
  });

  console.log('✅ Rental offers created');

  // ============== RÉSERVATIONS DE LOCATION ==============
  console.log('\n📅 Creating rental bookings...');

  // User2 loue chez User1
  await prisma.rentalBooking.create({
    data: {
      rentalOfferId: offer1.id,
      renterId: USER2_ID,
      startDate: addDays(7),
      endDate: addDays(10),
      totalPrice: 75000,
      status: 'CONFIRMED',
    },
  });

  // User1 loue chez User2
  await prisma.rentalBooking.create({
    data: {
      rentalOfferId: offer2.id,
      renterId: USER1_ID,
      startDate: addDays(14),
      endDate: addDays(17),
      totalPrice: 90000,
      status: 'PENDING',
    },
  });

  await prisma.rentalBooking.create({
    data: {
      rentalOfferId: offer3.id,
      renterId: USER1_ID,
      startDate: addDays(20),
      endDate: addDays(25),
      totalPrice: 250000,
      status: 'PENDING',
    },
  });

  // Admin loue aussi
  await prisma.rentalBooking.create({
    data: {
      rentalOfferId: offer1.id,
      renterId: ADMIN_ID,
      startDate: addDays(30),
      endDate: addDays(32),
      totalPrice: 50000,
      status: 'CONFIRMED',
    },
  });

  // Réservations passées
  await prisma.rentalBooking.create({
    data: {
      rentalOfferId: offer2.id,
      renterId: USER1_ID,
      startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      totalPrice: 120000,
      status: 'COMPLETED',
    },
  });

  console.log('✅ Rental bookings created');

  // ============== RÉSUMÉ ==============
  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log('   - 3 Users (1 Admin, 2 Users)');
  console.log('   - 7 Vehicles (5 approved, 1 pending, 1 rejected)');
  console.log('   - 8 Vehicle photos');
  console.log('   - 11 Vehicle documents');
  console.log('   - 11 Carpool trips (9 open, 2 completed)');
  console.log('   - 7 Carpool reservations');
  console.log('   - 3 Rental offers');
  console.log('   - 5 Rental bookings');
  console.log('\n👤 User IDs:');
  console.log(`   Admin: ${ADMIN_ID}`);
  console.log(`   User 1: ${USER1_ID}`);
  console.log(`   User 2: ${USER2_ID}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
