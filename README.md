# Taagno API

API REST de covoiturage et location de véhicules (MVP) - NestJS + PostgreSQL + Prisma

## Prérequis

- Node.js >= 18
- PostgreSQL >= 14
- npm ou yarn

## Installation

```bash
# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Créer la base de données et appliquer les migrations
npx prisma migrate dev --name init

# Peupler la base de données avec des données de test
npm run prisma:seed
```

## Configuration

Créer un fichier `.env` à la racine du projet :

```env
# Database
DATABASE_URL="postgresql://postgres:passer@localhost:5432/taagnobdd?schema=public"

# JWT
JWT_SECRET="taagno-jwt-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Google OAuth2
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3008/api/auth/google/callback"

# App
PORT=3008
NODE_ENV="development"
```

## Démarrage

```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

L'API sera disponible sur `http://localhost:3008`

Documentation Swagger : `http://localhost:3008/api/docs`

## Structure du projet

```
src/
├── common/
│   ├── decorators/       # @CurrentUser, @Roles
│   ├── filters/          # HttpExceptionFilter
│   ├── guards/           # RolesGuard, ActiveUserGuard
│   ├── interceptors/     # LoggingInterceptor
│   └── prisma/           # PrismaService, PrismaModule
├── modules/
│   ├── auth/             # Google OAuth2, JWT
│   ├── users/            # Gestion utilisateurs
│   ├── vehicles/         # Gestion véhicules
│   ├── admin/            # Administration (validation véhicules)
│   ├── carpool/          # Covoiturage
│   └── rental/           # Location
├── app.module.ts
└── main.ts
```

## Règles métier

### Véhicules
- Un véhicule est **PENDING** par défaut à la création
- Seul un **ADMIN** peut approuver ou rejeter un véhicule
- Un véhicule doit être **APPROVED** pour créer un trajet ou une offre de location

### Covoiturage
- Le véhicule doit être APPROVED et appartenir au conducteur
- Réservation avec transaction Prisma (gestion de la concurrence)
- Le conducteur accepte/refuse manuellement les réservations (PENDING → CONFIRMED/REJECTED)
- Si availableSeats = 0, le trajet passe en status FULL
- Annulation d'un trajet : toutes les réservations non terminées → CANCELLED

### Location
- Une offre pointe sur un véhicule APPROVED (relation unique)
- Calcul du prix : `totalPrice = pricePerDay × nbDays` (nbDays = différence en jours, exclusif)
- Vérification des chevauchements : refuse si overlap avec une booking CONFIRMED
- Le propriétaire accepte/refuse manuellement les réservations

### Autorisations
- Un USER ne peut modifier/supprimer que ses propres ressources
- Un ADMIN peut tout voir et valider
- Un utilisateur inactif (isActive=false) est bloqué

## Endpoints API

### Auth
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/auth/google` | Initier connexion Google |
| GET | `/api/auth/google/callback` | Callback Google OAuth2 |
| GET | `/api/auth/me` | Utilisateur connecté |

### Users
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/me` | Profil utilisateur |

### Vehicles
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/vehicles` | Créer un véhicule |
| GET | `/api/vehicles/mine` | Mes véhicules |
| GET | `/api/vehicles/:id` | Détails véhicule |
| PATCH | `/api/vehicles/:id` | Modifier véhicule |
| POST | `/api/vehicles/:id/photos` | Ajouter photo |
| POST | `/api/vehicles/:id/documents` | Ajouter document |

### Admin
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/vehicles?status=PENDING` | Lister véhicules |
| PATCH | `/api/admin/vehicles/:id/approve` | Approuver |
| PATCH | `/api/admin/vehicles/:id/reject` | Rejeter |

### Carpool
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/carpool/trips` | Créer trajet |
| GET | `/api/carpool/trips/search` | Rechercher trajets |
| GET | `/api/carpool/trips/:id` | Détails trajet |
| POST | `/api/carpool/trips/:id/reservations` | Réserver |
| PATCH | `/api/carpool/reservations/:id/accept` | Accepter réservation |
| PATCH | `/api/carpool/reservations/:id/reject` | Refuser réservation |
| PATCH | `/api/carpool/trips/:id/cancel` | Annuler trajet |

### Rental
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/rental/offers` | Créer offre |
| PATCH | `/api/rental/offers/:id` | Modifier offre |
| GET | `/api/rental/offers/search` | Rechercher offres |
| GET | `/api/rental/offers/:id` | Détails offre |
| POST | `/api/rental/offers/:id/bookings` | Réserver |
| PATCH | `/api/rental/bookings/:id/accept` | Accepter |
| PATCH | `/api/rental/bookings/:id/reject` | Refuser |

## Exemples de payload

### Créer un véhicule
```json
POST /api/vehicles
{
  "brand": "Peugeot",
  "model": "308",
  "year": 2020,
  "color": "Gris",
  "licensePlate": "AB-123-CD",
  "numberOfSeats": 5,
  "isForRental": false,
  "isForCarpooling": true
}
```

### Créer un trajet
```json
POST /api/carpool/trips
{
  "vehicleId": "uuid-du-vehicule",
  "departureCity": "Paris",
  "arrivalCity": "Lyon",
  "departureTime": "2024-12-25T10:00:00Z",
  "pricePerSeat": 25,
  "availableSeats": 3
}
```

### Réserver un trajet
```json
POST /api/carpool/trips/:id/reservations
{
  "seatsReserved": 2
}
```

### Créer une offre de location
```json
POST /api/rental/offers
{
  "vehicleId": "uuid-du-vehicule",
  "pricePerDay": 50,
  "depositAmount": 500,
  "minDays": 2
}
```

### Réserver une location
```json
POST /api/rental/offers/:id/bookings
{
  "startDate": "2024-12-25",
  "endDate": "2024-12-30"
}
```

## Données de seed

Le seed crée :
- 1 admin : `admin@taagno.com`
- 3 utilisateurs : `jean.dupont@gmail.com`, `marie.martin@gmail.com`, `pierre.durand@gmail.com`
- 2 véhicules approuvés
- 1 trajet de covoiturage (Paris → Lyon)
- 1 offre de location

## Sécurité

- **Helmet** : Headers de sécurité HTTP
- **CORS** : Activé
- **Rate Limiting** : Protection contre les abus
- **JWT** : Authentification stateless
- **Validation** : class-validator sur tous les DTOs
