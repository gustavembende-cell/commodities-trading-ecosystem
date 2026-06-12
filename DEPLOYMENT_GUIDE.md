# Guide de Déploiement - Commodities Trading Ecosystem

## Architecture de Déploiement

```
┌─────────────────────────────────────────────┐
│       Frontend (Vercel)                     │
│     Next.js 14 + TailwindCSS                │
│  https://votre-app.vercel.app              │
└──────────────────┬──────────────────────────┘
                   │ API Call
                   ↓
┌─────────────────────────────────────────────┐
│    Backend + Services (Railway)             │
│   Node.js + Express + Socket.io             │
│   https://api-prod.railway.app              │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ↓                     ↓
   ┌─────────┐          ┌──────────┐
   │PostgreSQL│          │  Redis   │
   │(Railway) │          │(Railway) │
   └─────────┘          └──────────┘
```

## 🚀 Étape 1 : Déployer le Frontend sur Vercel

### 1.1 Créer un compte Vercel
1. Accédez à [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up"
3. Connectez-vous avec GitHub

### 1.2 Importer le projet
1. Allez sur le dashboard Vercel
2. Cliquez sur "Add New..." → "Project"
3. Sélectionnez votre repo `commodities-trading-ecosystem`

### 1.3 Configurer le projet
```
Root Directory: frontend
Build Command: npm run build
Output Directory: .next
```

### 1.4 Ajouter les variables d'environnement
Allez dans **Settings** → **Environment Variables** et ajoutez :

```
NEXT_PUBLIC_API_URL=https://api-prod.railway.app
```

### 1.5 Déployer
Cliquez sur "Deploy" - Vercel déploiera automatiquement !

**Votre Frontend sera accessible à :** `https://votre-app.vercel.app`

---

## 🚀 Étape 2 : Déployer le Backend sur Railway

### 2.1 Créer un compte Railway
1. Accédez à [railway.app](https://railway.app)
2. Cliquez sur "Start Project"
3. Connectez-vous avec GitHub

### 2.2 Créer un nouveau projet
1. Cliquez sur "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez `gustavembende-cell/commodities-trading-ecosystem`

### 2.3 Ajouter les services

#### PostgreSQL
```bash
1. Cliquez sur "+ Add Service"
2. Sélectionnez "Database" → "PostgreSQL"
3. Railway créera automatiquement la base de données
```

#### Redis
```bash
1. Cliquez sur "+ Add Service"
2. Sélectionnez "Database" → "Redis"
3. Railway créera automatiquement le service Redis
```

### 2.4 Configurer le Backend
1. Cliquez sur "+ Add Service" → "GitHub Repo"
2. Sélectionnez le repo
3. Configurez le build :
   - **Root Directory** : `backend`
   - **Dockerfile** : `backend/Dockerfile`

### 2.5 Configurer les variables d'environnement

Allez dans votre projet Railroad → Variables et ajoutez :

```env
NODE_ENV=production
PORT=5000
LOG_LEVEL=info

# Base de données (Railway la fournira automatiquement)
DB_HOST=${{ DATABASE_PRIVATE_URL_POSTGRES }}
DB_PORT=5432
DB_NAME=commodities_trading
DB_USER=${{ DATABASE_USER }}
DB_PASSWORD=${{ DATABASE_PASSWORD }}

# Redis (Railway la fournira automatiquement)
REDIS_HOST=${{ REDIS_PRIVATE_URL }}
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=https://votre-app.vercel.app

# API Keys (à remplir avec vos clés)
IEX_CLOUD_API_KEY=your_key_here
ALPHA_VANTAGE_API_KEY=your_key_here
FRED_API_KEY=your_key_here
NEWSAPI_KEY=your_key_here
FINNHUB_API_KEY=your_key_here

# Webhooks (optionnel)
SLACK_WEBHOOK_URL=your_webhook_here
DISCORD_WEBHOOK_URL=your_webhook_here

# Monitors
ENABLE_EIA_MONITOR=true
ENABLE_USDA_MONITOR=true
ENABLE_COT_ANALYSIS=true
ENABLE_NEWS_AGGREGATION=true
ENABLE_RADIO_STREAMING=true
```

### 2.6 Déployer
Railway déploiera automatiquement quand vous pushez du code sur le repo !

**Votre Backend sera accessible à :** `https://api-prod.railway.app`

---

## 🔗 Étape 3 : Connecter Frontend et Backend

### 3.1 Mettre à jour Vercel
1. Allez dans **Settings** → **Environment Variables**
2. Mettez à jour `NEXT_PUBLIC_API_URL` avec l'URL de votre backend Railway
3. Déclenchez un redéploiement

---

## 📊 Étape 4 : Monitoring et Logs

### Vercel
- Logs du Frontend : Dashboard Vercel → Deployments → Logs
- Analytics : Dashboard Vercel → Analytics

### Railway
- Logs du Backend : Dashboard Railway → Logs
- Métriques : Dashboard Railway → Metrics
- Base de données : Dashboard Railway → Database

---

## 🔐 Sécurité et Bonnes Pratiques

### 1. Environment Variables
✅ **À faire :**
- Stocker les clés API dans les variables d'environnement
- Utiliser des secrets Railway pour les données sensibles

❌ **À éviter :**
- Commiter les `.env` files
- Stocker les clés dans le code

### 2. CORS
```typescript
// backend/src/index.ts - Déjà configuré
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});
```

### 3. Rate Limiting
À ajouter prochainement pour protéger l'API.

---

## 🔄 Workflow de Déploiement Continu

```bash
1. Développer localement
   git checkout -b feature/new-feature
   
2. Tester
   npm test
   
3. Pusher sur GitHub
   git push origin feature/new-feature
   
4. Créer une Pull Request
   
5. Vérifier les tests automatisés
   
6. Merger dans main
   git merge --squash feature/new-feature
   
7. Déploiement automatique
   - Frontend sur Vercel
   - Backend sur Railway
```

---

## 📱 Commandes Utiles

### Vercel CLI
```bash
# Installer
npm i -g vercel

# Déployer
vercel --prod

# Voir les logs
vercel logs

# Variables d'environnement
vercel env ls
```

### Railway CLI
```bash
# Installer
npm i -g railway

# Login
railway login

# Déployer
railway up

# Voir les logs
railway logs

# Variables d'environnement
railway variables
```

---

## 🆘 Dépannage

### Frontend ne se charge pas
1. Vérifier `NEXT_PUBLIC_API_URL` dans Vercel
2. Vérifier les logs Vercel
3. Vérifier la console du navigateur

### Backend ne répond pas
1. Vérifier les logs Railway
2. Vérifier les variables d'environnement
3. Vérifier la connexion à la base de données
4. Vérifier la connexion à Redis

### Base de données ne répond pas
1. Vérifier le statut sur Railway
2. Vérifier `DB_HOST`, `DB_USER`, `DB_PASSWORD`
3. Vérifier les migrations

### Socket.io ne fonctionne pas
1. Vérifier `FRONTEND_URL` dans les variables Railway
2. Vérifier la configuration CORS
3. Vérifier les logs WebSocket

---

## 📈 Prochaines Étapes

1. **Ajouter des tests automatisés**
   ```bash
   npm run test
   ```

2. **Configurer les alertes**
   - Erreurs d'API
   - Downtime de la base de données
   - Consommation de ressources

3. **Optimiser les performances**
   - Caching avec Redis
   - Compression des réponses
   - Pagination des données

4. **Ajouter du monitoring**
   - Sentry pour les erreurs
   - New Relic pour les performances
   - DataDog pour le logging

---

## 📞 Support

- **Vercel Support** : https://vercel.com/support
- **Railway Support** : https://railway.app/docs
- **Documentation Backend** : Voir `/docs/API.md`
- **Documentation Frontend** : Voir `/frontend/README.md`
