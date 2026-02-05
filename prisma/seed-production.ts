import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = '920f0ef6-c1be-4ded-8d63-61a98874ec32';

// Villes du Sénégal pour les trajets
const cities = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Mbour', 'Touba', 
  'Kaolack', 'Ziguinchor', 'Tambacounda', 'Rufisque', 'Diourbel'
];

// Véhicules à créer
const vehicles = [
  {
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    color: 'Blanc',
    licensePlate: 'DK-1234-AA',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: true,
  },
  {
    brand: 'Peugeot',
    model: '308',
    year: 2019,
    color: 'Gris',
    licensePlate: 'DK-5678-BB',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: true,
  },
  {
    brand: 'Renault',
    model: 'Duster',
    year: 2021,
    color: 'Noir',
    licensePlate: 'DK-9012-CC',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: false,
  },
  {
    brand: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    color: 'Bleu',
    licensePlate: 'DK-3456-DD',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: true,
  },
  {
    brand: 'Kia',
    model: 'Sportage',
    year: 2020,
    color: 'Rouge',
    licensePlate: 'DK-7890-EE',
    numberOfSeats: 5,
    isForRental: false,
    isForCarpooling: true,
  },
  {
    brand: 'Mercedes',
    model: 'Classe C',
    year: 2021,
    color: 'Argent',
    licensePlate: 'DK-1122-FF',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: false,
  },
  {
    brand: 'Ford',
    model: 'Ranger',
    year: 2019,
    color: 'Blanc',
    licensePlate: 'DK-3344-GG',
    numberOfSeats: 5,
    isForRental: true,
    isForCarpooling: true,
  },
  {
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2020,
    color: 'Jaune',
    licensePlate: 'DK-5566-HH',
    numberOfSeats: 5,
    isForRental: false,
    isForCarpooling: true,
  },
];

// Prix de location par jour selon le véhicule
const rentalPrices: Record<string, { pricePerDay: number; depositAmount: number }> = {
  'Toyota Corolla': { pricePerDay: 25000, depositAmount: 100000 },
  'Peugeot 308': { pricePerDay: 22000, depositAmount: 80000 },
  'Renault Duster': { pricePerDay: 30000, depositAmount: 120000 },
  'Hyundai Tucson': { pricePerDay: 35000, depositAmount: 150000 },
  'Mercedes Classe C': { pricePerDay: 50000, depositAmount: 200000 },
  'Ford Ranger': { pricePerDay: 40000, depositAmount: 150000 },
};

// Trajets de covoiturage populaires
const carpoolRoutes = [
  { from: 'Dakar', to: 'Thiès', price: 2500, duration: '1h' },
  { from: 'Dakar', to: 'Saint-Louis', price: 5000, duration: '3h' },
  { from: 'Dakar', to: 'Mbour', price: 3000, duration: '1h30' },
  { from: 'Dakar', to: 'Touba', price: 4000, duration: '2h30' },
  { from: 'Thiès', to: 'Kaolack', price: 3500, duration: '2h' },
  { from: 'Dakar', to: 'Ziguinchor', price: 10000, duration: '6h' },
  { from: 'Saint-Louis', to: 'Dakar', price: 5000, duration: '3h' },
  { from: 'Mbour', to: 'Dakar', price: 3000, duration: '1h30' },
  { from: 'Touba', to: 'Dakar', price: 4000, duration: '2h30' },
  { from: 'Dakar', to: 'Tambacounda', price: 8000, duration: '5h' },
];

async function main() {
  console.log('🚀 Démarrage du seed de production...');

  // 1. Mettre à jour l'utilisateur en mode PROPRIETAIRE
  console.log('👤 Mise à jour de l\'utilisateur en mode PROPRIETAIRE...');
  await prisma.user.update({
    where: { id: USER_ID },
    data: { userMode: 'PROPRIETAIRE' },
  });

  // 2. Supprimer les anciennes données de test pour cet utilisateur
  console.log('🗑️ Suppression des anciennes données...');
  await prisma.carpoolTrip.deleteMany({ where: { driverId: USER_ID } });
  await prisma.vehicle.deleteMany({ where: { ownerId: USER_ID } });

  // 3. Créer les véhicules
  console.log('🚗 Création des véhicules...');
  const createdVehicles = [];
  
  for (const vehicle of vehicles) {
    const created = await prisma.vehicle.create({
      data: {
        ...vehicle,
        ownerId: USER_ID,
        status: 'APPROVED', // Véhicules approuvés pour les tests
        isActive: true,
      },
    });
    createdVehicles.push(created);
    console.log(`   ✅ ${vehicle.brand} ${vehicle.model} créé`);
  }

  // 4. Créer les offres de location pour les véhicules éligibles
  console.log('🏷️ Création des offres de location...');
  for (const vehicle of createdVehicles) {
    if (vehicle.isForRental) {
      const key = `${vehicle.brand} ${vehicle.model}`;
      const pricing = rentalPrices[key] || { pricePerDay: 25000, depositAmount: 100000 };
      
      await prisma.rentalOffer.create({
        data: {
          vehicleId: vehicle.id,
          pricePerDay: pricing.pricePerDay,
          depositAmount: pricing.depositAmount,
          minDays: 1,
          isActive: true,
        },
      });
      console.log(`   ✅ Offre de location pour ${vehicle.brand} ${vehicle.model}: ${pricing.pricePerDay} FCFA/jour`);
    }
  }

  // 5. Créer les trajets de covoiturage
  console.log('🛣️ Création des trajets de covoiturage...');
  const carpoolVehicles = createdVehicles.filter(v => v.isForCarpooling);
  
  for (let i = 0; i < carpoolRoutes.length; i++) {
    const route = carpoolRoutes[i];
    const vehicle = carpoolVehicles[i % carpoolVehicles.length];
    
    // Créer des trajets pour les prochains jours
    const daysAhead = Math.floor(Math.random() * 14) + 1; // 1 à 14 jours
    const departureTime = new Date();
    departureTime.setDate(departureTime.getDate() + daysAhead);
    departureTime.setHours(6 + Math.floor(Math.random() * 12), 0, 0, 0); // Entre 6h et 18h

    await prisma.carpoolTrip.create({
      data: {
        vehicleId: vehicle.id,
        driverId: USER_ID,
        departureCity: route.from,
        arrivalCity: route.to,
        departureTime,
        pricePerSeat: route.price,
        availableSeats: Math.floor(Math.random() * 3) + 2, // 2 à 4 places
        status: 'OPEN',
      },
    });
    console.log(`   ✅ Trajet ${route.from} → ${route.to}: ${route.price} FCFA/place`);
  }

  // 6. Afficher le résumé
  const vehicleCount = await prisma.vehicle.count({ where: { ownerId: USER_ID } });
  const rentalCount = await prisma.rentalOffer.count({ 
    where: { vehicle: { ownerId: USER_ID } } 
  });
  const tripCount = await prisma.carpoolTrip.count({ where: { driverId: USER_ID } });

  console.log('\n📊 Résumé:');
  console.log(`   - ${vehicleCount} véhicules créés`);
  console.log(`   - ${rentalCount} offres de location créées`);
  console.log(`   - ${tripCount} trajets de covoiturage créés`);
  console.log('\n✅ Seed de production terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
