# Notes de Production - Taagno Backend

## ⚠️ Points Importants pour la Production

### 1. Gestion des Fichiers Uploadés

Le projet utilise actuellement un stockage local des fichiers dans le dossier `uploads/`. **Ceci ne fonctionnera pas correctement sur Railway** car le système de fichiers est éphémère.

#### Solutions Recommandées :

**Option A : Utiliser un Service de Stockage Cloud (RECOMMANDÉ)**
- **AWS S3** : Service de stockage d'objets d'Amazon
- **Cloudinary** : Spécialisé pour les images et vidéos
- **Google Cloud Storage** : Service de Google Cloud
- **DigitalOcean Spaces** : Alternative économique compatible S3

**Option B : Utiliser Railway Volumes (Temporaire)**
- Railway propose des volumes persistants
- Limité et plus coûteux
- Non recommandé pour la production à long terme

#### Migration vers Cloudinary (Exemple)

```bash
npm install cloudinary multer-storage-cloudinary
```

Modifier `upload.service.ts` pour utiliser Cloudinary au lieu du stockage local.

### 2. Variables d'Environnement Obligatoires

Assurez-vous de configurer ces variables dans Railway :

```bash
DATABASE_URL=<fourni automatiquement par Railway>
JWT_SECRET=<générer une clé forte>
GOOGLE_CLIENT_ID=<votre client ID Google>
GOOGLE_CLIENT_SECRET=<votre secret Google>
GOOGLE_CALLBACK_URL=https://votre-backend.railway.app/api/auth/google/callback
NODE_ENV=production
APP_URL=https://votre-backend.railway.app
FRONTEND_URL=https://votre-frontend-url.com
PORT=3008
```

### 3. Configuration Google OAuth

N'oubliez pas de mettre à jour votre projet Google Cloud Console :
1. Ajoutez l'URL Railway dans les "Authorized redirect URIs"
2. Format : `https://votre-backend.railway.app/api/auth/google/callback`
3. Ajoutez aussi l'URL frontend dans les "Authorized JavaScript origins"

### 4. CORS et Sécurité

La configuration CORS est déjà adaptée pour la production :
- Accepte uniquement le frontend configuré via `FRONTEND_URL`
- Accepte les domaines `.railway.app` pour les tests
- Helmet activé pour la sécurité HTTP

### 5. Base de Données

Railway provisionne automatiquement PostgreSQL :
- La variable `DATABASE_URL` est injectée automatiquement
- Les migrations Prisma s'exécutent automatiquement au déploiement
- Pensez à sauvegarder régulièrement votre base de données

### 6. Monitoring et Logs

- Consultez les logs Railway pour le debugging
- Activez les alertes Railway pour être notifié des erreurs
- Considérez l'ajout d'un service de monitoring (Sentry, LogRocket, etc.)

### 7. Performance

Pour améliorer les performances en production :
- Activez la compression gzip (ajouter le middleware compression)
- Configurez un CDN pour les fichiers statiques
- Optimisez les requêtes Prisma avec des index appropriés

### 8. Seed de la Base de Données

Le fichier `prisma/seed.ts` est configuré pour les tests locaux.
**Ne l'exécutez PAS en production** sauf si vous voulez des données de test.

Pour seed en production (si nécessaire) :
```bash
npm run prisma:seed
```

### 9. Backup et Restauration

Railway offre des backups automatiques pour PostgreSQL, mais :
- Configurez des backups supplémentaires si critique
- Testez la restauration régulièrement
- Exportez les données importantes périodiquement

### 10. Scaling

Railway permet le scaling automatique :
- Configurez les limites de ressources
- Surveillez l'utilisation CPU/RAM
- Ajustez selon le trafic

## 🔧 Commandes Utiles Post-Déploiement

```bash
# Voir les logs en temps réel
railway logs

# Exécuter les migrations manuellement
railway run npx prisma migrate deploy

# Accéder à la console Prisma Studio
railway run npx prisma studio

# Redéployer
git push origin main
```

## 📋 Checklist Avant le Déploiement

- [ ] Toutes les variables d'environnement sont configurées
- [ ] Google OAuth callback URL est mis à jour
- [ ] Base de données PostgreSQL est provisionnée sur Railway
- [ ] Le frontend est déployé et l'URL est configurée
- [ ] Les CORS sont correctement configurés
- [ ] Solution de stockage cloud pour les uploads est implémentée (si nécessaire)
- [ ] Les secrets sont sécurisés (JWT_SECRET, etc.)
- [ ] Les logs sont configurés pour le monitoring
- [ ] Tests de l'API effectués

## 🚨 Problèmes Connus

### Uploads de Fichiers
Le stockage local ne persiste pas sur Railway. Migrez vers un service cloud avant la production.

### Prisma Generate
Si vous rencontrez des erreurs Prisma, assurez-vous que `postinstall` génère le client automatiquement.

### Port Binding
Railway assigne automatiquement un port via la variable `PORT`. Le code est déjà configuré pour l'utiliser.
