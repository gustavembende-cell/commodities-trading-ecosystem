# 🌾 Commodities Trading Ecosystem

Écosystème complet de trading de commodités avec données temps réel, notifications EIA/USDA, analyse COT, saisonnalité, interaction des marchés, positionnement retail et radio financière.

## 🎯 Fonctionnalités principales

### 📊 Données en temps réel
- **CME Futures**: Pétrole, gaz naturel, or, argent, blé, maïs, soja
- **ICE**: Café, cacao, sucre, coton
- **LBMA**: Métaux précieux
- **CBOT**: Produits agricoles
- **WebSocket streaming**: Updates tick-by-tick

### 🚨 Notifications intelligentes
- **Calendrier économique**: EIA (Energy), USDA (Agriculture)
- **Alertes prix**: Seuils dynamiques
- **News triggers**: Agrégation temps réel
- **Multi-canal**: Email, Slack, Discord

### 📈 Analyses avancées
- **COT Reports**: Positionnement commerciaux vs speculateurs
- **Saisonnalité**: Patterns historiques et spreads
- **Corrélations**: Interactions USD/taux/équities
- **Positionnement retail**: Sentiment CFTC
- **Technical**: MACD, Bollinger, RSI

### 🎙️ Radio & News
- **Agrégation news**: 50+ sources
- **Sentiment analysis**: NLP real-time
- **Streaming radio**: Bloomberg, CNBC, Yahoo Finance
- **Podcast**: Trading, macro, agriculture

## 🏗️ Stack technique

**Backend:** Node.js • TypeScript • Express • Bull • Socket.io
**DB:** TimescaleDB • PostgreSQL • Redis
**Frontend:** Next.js 14 • React • TailwindCSS • Socket.io-client

## 🚀 Quick Start

```bash
git clone https://github.com/yourusername/commodities-trading-ecosystem.git
cd commodities-trading-ecosystem
cp .env.example .env
docker-compose up -d
npm run migrate
npm run dev
```

Accédez à http://localhost:3000

## 📋 Structure

```
├── backend/          # API Node.js/Express
├── frontend/         # Next.js dashboard
├── infrastructure/   # DB schemas
└── docker-compose.yml
```

## 🔑 API Keys requis

- IEX Cloud, Alpha Vantage, FRED, NewsAPI, Finnhub
- Slack/Discord webhooks (optionnel)

Voir `.env.example` pour la configuration complète.

## 📄 Licence

MIT
