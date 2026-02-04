# Documentation Swagger API - Taagno Backend

## 🎯 Accès à la Documentation

### En Développement
```
http://localhost:3008/api/docs
```

### En Production (Railway)
```
https://votre-backend.railway.app/api/docs
```

## 📚 Vue d'ensemble

L'API Taagno est entièrement documentée avec Swagger/OpenAPI. La documentation interactive permet de :
- ✅ Visualiser tous les endpoints disponibles
- ✅ Tester les requêtes directement depuis l'interface
- ✅ Voir les schémas de données (DTOs)
- ✅ Comprendre les codes de réponse HTTP
- ✅ Gérer l'authentification Bearer Token

## 🔐 Authentification

L'API utilise JWT (JSON Web Tokens) pour l'authentification.

### Obtenir un Token

1. **Via Google OAuth2** (recommandé)
   ```
   GET /api/auth/google
   ```
   - Redirige vers Google pour l'authentification
   - Après succès, redirige vers le frontend avec le token

2. **Utiliser le Token dans Swagger**
   - Cliquez sur le bouton "Authorize" 🔒 en haut à droite
   - Entrez : `Bearer <votre-token>`
   - Tous les endpoints protégés utiliseront ce token

### Endpoints d'Authentification

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/auth/google` | GET | Initier la connexion Google OAuth2 |
| `/api/auth/google/callback` | GET | Callback après authentification Google |
| `/api/auth/me` | GET | Récupérer l'utilisateur connecté |

## 📋 Modules de l'API

### 1. 👤 Users (Utilisateurs)
**Tag Swagger:** `users`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/users/me` | GET | Profil utilisateur | ✅ |
| `/api/users/me/mode` | PATCH | Changer mode (VOYAGEUR/PROPRIETAIRE) | ✅ |

### 2. 🚗 Vehicles (Véhicules)
**Tag Swagger:** `vehicles`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/vehicles` | GET | Liste des véhicules de l'utilisateur | ✅ |
| `/api/vehicles` | POST | Créer un véhicule | ✅ |
| `/api/vehicles/:id` | GET | Détails d'un véhicule | ✅ |
| `/api/vehicles/:id` | PATCH | Modifier un véhicule | ✅ |
| `/api/vehicles/:id` | DELETE | Supprimer un véhicule | ✅ |
| `/api/vehicles/:id/photos` | POST | Ajouter une photo | ✅ |
| `/api/vehicles/:id/photos/:photoId` | DELETE | Supprimer une photo | ✅ |
| `/api/vehicles/:id/documents` | POST | Ajouter un document | ✅ |
| `/api/vehicles/:id/documents/:docId` | DELETE | Supprimer un document | ✅ |

**Exemple de création de véhicule:**
```json
{
  "brand": "Toyota",
  "model": "Corolla",
  "year": 2022,
  "color": "Blanc",
  "licensePlate": "DK-1234-AA",
  "numberOfSeats": 5,
  "isForRental": false,
  "isForCarpooling": true
}
```

### 3. 🚕 Carpool (Covoiturage)
**Tag Swagger:** `carpool`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/carpool/trips` | GET | Rechercher des trajets | ✅ |
| `/api/carpool/trips` | POST | Créer un trajet | ✅ |
| `/api/carpool/trips/my-trips` | GET | Mes trajets en tant que conducteur | ✅ |
| `/api/carpool/trips/:id` | GET | Détails d'un trajet | ✅ |
| `/api/carpool/trips/:id` | PATCH | Modifier un trajet | ✅ |
| `/api/carpool/trips/:id` | DELETE | Supprimer un trajet | ✅ |
| `/api/carpool/reservations` | POST | Réserver un trajet | ✅ |
| `/api/carpool/reservations/my-reservations` | GET | Mes réservations | ✅ |
| `/api/carpool/reservations/:id/status` | PATCH | Changer statut réservation | ✅ |

**Exemple de création de trajet:**
```json
{
  "vehicleId": "uuid-du-vehicule",
  "departureCity": "Dakar",
  "arrivalCity": "Thiès",
  "departureTime": "2024-12-25T10:00:00Z",
  "pricePerSeat": 2500,
  "availableSeats": 3
}
```

### 4. 🏠 Rental (Location)
**Tag Swagger:** `rental`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/rental/offers` | GET | Rechercher des offres de location | ✅ |
| `/api/rental/offers` | POST | Créer une offre de location | ✅ |
| `/api/rental/offers/my-offers` | GET | Mes offres de location | ✅ |
| `/api/rental/offers/:id` | GET | Détails d'une offre | ✅ |
| `/api/rental/offers/:id` | PATCH | Modifier une offre | ✅ |
| `/api/rental/offers/:id` | DELETE | Supprimer une offre | ✅ |
| `/api/rental/bookings` | POST | Réserver une location | ✅ |
| `/api/rental/bookings/my-bookings` | GET | Mes réservations de location | ✅ |
| `/api/rental/bookings/:id/status` | PATCH | Changer statut réservation | ✅ |

**Exemple de création d'offre:**
```json
{
  "vehicleId": "uuid-du-vehicule",
  "pricePerDay": 25000,
  "depositAmount": 100000,
  "minDays": 1,
  "isActive": true
}
```

### 5. 👨‍💼 Admin (Administration)
**Tag Swagger:** `admin`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/admin/vehicles` | GET | Liste tous les véhicules | ✅ Admin |
| `/api/admin/vehicles/:id/approve` | PATCH | Approuver un véhicule | ✅ Admin |
| `/api/admin/vehicles/:id/reject` | PATCH | Rejeter un véhicule | ✅ Admin |
| `/api/admin/documents/:id/approve` | PATCH | Approuver un document | ✅ Admin |
| `/api/admin/documents/:id/reject` | PATCH | Rejeter un document | ✅ Admin |
| `/api/admin/stats` | GET | Statistiques globales | ✅ Admin |

### 6. 📤 Upload (Téléchargement de fichiers)
**Tag Swagger:** `upload`

| Endpoint | Méthode | Description | Auth |
|----------|---------|-------------|------|
| `/api/upload` | POST | Upload un fichier (image/PDF) | ✅ |

**Formats acceptés:**
- Images: JPEG, PNG, GIF, WebP
- Documents: PDF
- Taille max: 10 MB

## 🔍 Filtres et Recherche

### Recherche de Trajets de Covoiturage
```
GET /api/carpool/trips?departureCity=Dakar&arrivalCity=Thiès&date=2024-12-25
```

### Recherche d'Offres de Location
```
GET /api/rental/offers?minPrice=20000&maxPrice=50000
```

## 📊 Codes de Réponse HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non authentifié |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 500 | Erreur serveur |

## 🎨 Schémas de Données (DTOs)

Tous les schémas de données sont documentés dans Swagger avec :
- Types de données
- Validations
- Exemples
- Champs obligatoires/optionnels

### Enums Principaux

**UserMode:**
- `VOYAGEUR` : Mode passager
- `PROPRIETAIRE` : Mode propriétaire

**VehicleStatus:**
- `PENDING` : En attente de validation
- `APPROVED` : Approuvé
- `REJECTED` : Rejeté

**CarpoolTripStatus:**
- `OPEN` : Ouvert aux réservations
- `FULL` : Complet
- `CANCELLED` : Annulé
- `COMPLETED` : Terminé

**RentalBookingStatus:**
- `PENDING` : En attente
- `CONFIRMED` : Confirmé
- `REJECTED` : Rejeté
- `CANCELLED` : Annulé
- `COMPLETED` : Terminé

## 🧪 Tester l'API

### Avec Swagger UI
1. Accédez à `/api/docs`
2. Cliquez sur "Authorize" et entrez votre token
3. Sélectionnez un endpoint
4. Cliquez sur "Try it out"
5. Remplissez les paramètres
6. Cliquez sur "Execute"

### Avec cURL
```bash
# Obtenir le profil utilisateur
curl -X GET "http://localhost:3008/api/users/me" \
  -H "Authorization: Bearer votre-token"

# Créer un véhicule
curl -X POST "http://localhost:3008/api/vehicles" \
  -H "Authorization: Bearer votre-token" \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Toyota",
    "model": "Corolla",
    "year": 2022,
    "color": "Blanc",
    "licensePlate": "DK-1234-AA",
    "numberOfSeats": 5,
    "isForCarpooling": true
  }'
```

### Avec Postman
1. Importez la collection depuis Swagger (bouton "Export")
2. Configurez l'authentification Bearer Token
3. Testez les endpoints

## 🔧 Configuration Swagger

La configuration Swagger se trouve dans `src/main.ts`:

```typescript
const config = new DocumentBuilder()
  .setTitle('Taagno API')
  .setDescription('API de covoiturage et location de véhicules')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', 'Authentification Google OAuth2')
  .addTag('users', 'Gestion des utilisateurs')
  .addTag('vehicles', 'Gestion des véhicules')
  .addTag('admin', 'Administration')
  .addTag('carpool', 'Covoiturage')
  .addTag('rental', 'Location de véhicules')
  .build();
```

## 📝 Notes Importantes

1. **Authentification requise** : La plupart des endpoints nécessitent un token JWT
2. **Validation automatique** : Les données sont validées avec class-validator
3. **Rate limiting** : L'API est protégée contre les abus avec throttler
4. **CORS** : Configuré pour accepter le frontend
5. **Sécurité** : Helmet activé pour la sécurité HTTP

## 🚀 Déploiement

En production sur Railway, Swagger reste accessible à :
```
https://votre-backend.railway.app/api/docs
```

⚠️ **Sécurité Production** : Considérez de restreindre l'accès à Swagger en production si nécessaire.

## 📞 Support

Pour toute question sur l'API :
- Consultez la documentation Swagger interactive
- Vérifiez les exemples de requêtes
- Consultez les schémas de données
