import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const USER_ID = '920f0ef6-c1be-4ded-8d63-61a98874ec32';

// Images de véhicules depuis Unsplash (images libres de droits)
const vehicleImages: Record<string, string[]> = {
  'Toyota Corolla': [
    'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800', // Extérieur blanc
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', // Intérieur
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800', // Vue latérale
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800', // Arrière
  ],
  'Peugeot 308': [
    'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', // Extérieur gris
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', // Vue dynamique
    'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800', // Intérieur moderne
    'https://images.unsplash.com/photo-1494976388531-d1058494ceb8?w=800', // Tableau de bord
    'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=800', // Vue arrière
  ],
  'Renault Duster': [
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', // SUV noir
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', // Vue latérale SUV
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', // SUV extérieur
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', // Vue avant
  ],
  'Hyundai Tucson': [
    'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800', // SUV bleu
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', // Vue moderne
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800', // Intérieur luxe
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800', // Vue latérale
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', // Arrière SUV
  ],
  'Kia Sportage': [
    'https://images.unsplash.com/photo-1568844293986-8c2a5c4e5e3d?w=800', // SUV rouge
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800', // Vue dynamique
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800', // Extérieur
    'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=800', // Intérieur
  ],
  'Mercedes Classe C': [
    'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?w=800', // Mercedes argent
    'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800', // Vue luxe
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', // Intérieur Mercedes
    'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800', // Vue avant
    'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800', // Tableau de bord luxe
  ],
  'Ford Ranger': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Pick-up blanc
    'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800', // Pick-up vue latérale
    'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800', // Pick-up extérieur
    'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800', // Intérieur robuste
  ],
  'Volkswagen Polo': [
    'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800', // Citadine jaune
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800', // Vue compacte
    'https://images.unsplash.com/photo-1494976388531-d1058494ceb8?w=800', // Intérieur compact
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800', // Vue arrière
    'https://images.unsplash.com/photo-1493238792000-8113da705763?w=800', // Vue dynamique
  ],
};

async function main() {
  console.log('🖼️ Ajout des photos aux véhicules...\n');

  // Récupérer tous les véhicules de l'utilisateur
  const vehicles = await prisma.vehicle.findMany({
    where: { ownerId: USER_ID },
    orderBy: { createdAt: 'asc' },
  });

  if (vehicles.length === 0) {
    console.log('❌ Aucun véhicule trouvé pour cet utilisateur.');
    return;
  }

  console.log(`📋 ${vehicles.length} véhicules trouvés\n`);

  // Supprimer les anciennes photos
  console.log('🗑️ Suppression des anciennes photos...');
  await prisma.vehiclePhoto.deleteMany({
    where: {
      vehicle: { ownerId: USER_ID }
    }
  });

  // Ajouter les photos pour chaque véhicule
  for (const vehicle of vehicles) {
    const key = `${vehicle.brand} ${vehicle.model}`;
    const images = vehicleImages[key];

    if (!images || images.length === 0) {
      console.log(`⚠️ Pas d'images définies pour ${key}`);
      continue;
    }

    console.log(`\n🚗 ${key}:`);

    for (let i = 0; i < images.length; i++) {
      const isMain = i === 0; // La première image est l'image principale
      
      await prisma.vehiclePhoto.create({
        data: {
          vehicleId: vehicle.id,
          url: images[i],
          isMain,
        },
      });

      console.log(`   ${isMain ? '⭐' : '📷'} Photo ${i + 1}/${images.length} ajoutée${isMain ? ' (principale)' : ''}`);
    }
  }

  // Résumé
  const totalPhotos = await prisma.vehiclePhoto.count({
    where: { vehicle: { ownerId: USER_ID } }
  });

  console.log('\n📊 Résumé:');
  console.log(`   - ${vehicles.length} véhicules`);
  console.log(`   - ${totalPhotos} photos ajoutées au total`);
  console.log('\n✅ Photos ajoutées avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
