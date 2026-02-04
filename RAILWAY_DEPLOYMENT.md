# Guide de Déploiement Railway - Taagno Backend

## 📋 Prérequis

1. Compte Railway (https://railway.app)
2. Projet Railway créé
3. Base de données PostgreSQL provisionnée sur Railway

## 🚀 Étapes de Déploiement

### 1. Créer un Nouveau Projet sur Railway

1. Connectez-vous à Railway
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Connectez votre repository GitHub contenant ce projet

### 2. Provisionner une Base de Données PostgreSQL

1. Dans votre projet Railway, cliquez sur "+ New"
2. Sélectionnez "Database" → "Add PostgreSQL"
3. Railway créera automatiquement une base de données PostgreSQL
4. La variable `DATABASE_URL` sera automatiquement disponible

### 3. Configurer les Variables d'Environnement

Dans l'onglet "Variables" de votre service backend, ajoutez les variables suivantes :

```bash
# La DATABASE_URL est automatiquement fournie par Railway
# Vous devez ajouter les suivantes :

JWT_SECRET=votre-secret-jwt-securise-production
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=votre-google-client-id
GOOGLE_CLIENT_SECRET=votre-google-client-secret
GOOGLE_CALLBACK_URL=https://votre-backend.railway.app/api/auth/google/callback

NODE_ENV=production

FRONTEND_URL=https://votre-frontend-url.com

PORT=3008
```

### 4. Configuration Automatique

Le déploiement est configuré pour :
- ✅ Installer les dépendances
- ✅ Générer le client Prisma
- ✅ Builder l'application NestJS
- ✅ Exécuter les migrations Prisma automatiquement
- ✅ Démarrer l'application en mode production

### 5. Déploiement

1. Railway détectera automatiquement le `railway.json` et le `Procfile`
2. Le build commencera automatiquement
3. Les migrations seront exécutées avant le démarrage
4. L'application sera accessible via l'URL fournie par Railway

## 📝 Fichiers de Configuration

### `railway.json`
Configure le processus de build et de déploiement :
- Build : Installation + Génération Prisma + Build NestJS
- Deploy : Migration Prisma + Démarrage production

### `Procfile`
Définit la commande de démarrage : `npm run start:prod`

### `.env.example`
Template des variables d'environnement nécessaires

## 🔍 Vérifications Post-Déploiement

1. **Vérifier les logs** : Consultez les logs Railway pour confirmer le démarrage
2. **Tester l'API** : Accédez à `https://votre-backend.railway.app/api/docs` pour Swagger
3. **Vérifier la base de données** : Assurez-vous que les migrations ont été appliquées
4. **Tester l'authentification Google** : Vérifiez que le callback URL est correct

## 🛠️ Commandes Utiles

```bash
# Générer le client Prisma localement
npm run prisma:generate

# Créer une nouvelle migration
npm run prisma:migrate

# Déployer les migrations (utilisé par Railway)
npm run prisma:migrate:deploy

# Build local
npm run build

# Démarrer en production localement
npm run start:prod
```

## ⚠️ Points Importants

1. **DATABASE_URL** : Railway la fournit automatiquement, ne la modifiez pas
2. **JWT_SECRET** : Utilisez une valeur forte et unique en production
3. **GOOGLE_CALLBACK_URL** : Doit correspondre à l'URL Railway de votre backend
4. **FRONTEND_URL** : Configurez l'URL de votre frontend pour CORS
5. **Migrations** : Elles s'exécutent automatiquement au déploiement

## 🔐 Sécurité

- ✅ Les secrets sont stockés dans les variables d'environnement Railway
- ✅ CORS configuré pour accepter uniquement le frontend en production
- ✅ Helmet activé pour la sécurité HTTP
- ✅ Validation des données avec class-validator
- ✅ JWT pour l'authentification

## 📞 Support

En cas de problème :
1. Consultez les logs Railway
2. Vérifiez que toutes les variables d'environnement sont définies
3. Assurez-vous que la base de données PostgreSQL est active
4. Vérifiez que les migrations Prisma ont été appliquées

## 🔄 Redéploiement

Pour redéployer après des modifications :
1. Poussez vos changements sur GitHub
2. Railway redéploiera automatiquement
3. Les migrations seront réexécutées si nécessaire
