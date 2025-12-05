# 🏗️ Architecture XSSHILOX

## Vue d'Ensemble

XSSHILOX est une application full-stack avec :

- **Backend** : Node.js + Express + SQLite + Socket.IO
- **Frontend** : Next.js 15 + React + Tailwind CSS v4
- **Base de données** : SQLite (fichier local)
- **Temps réel** : Socket.IO pour le lobby

---

## 📁 Structure du Projet

```
XSSHILOX/
│
├── 📂 backend/
│   ├── server.js              # Serveur Express principal
│   ├── config.js              # Configuration centralisée
│   ├── package.json           # Dépendances backend
│   │
│   └── 📂 database/
│       ├── db.js              # Gestionnaire SQLite
│       ├── schema.sql         # Schéma de la DB
│       └── xsshilox.db        # Base de données (auto-créée)
│
├── 📂 frontend/
│   ├── package.json           # Dépendances frontend
│   │
│   └── 📂 app/
│       ├── layout.tsx         # Layout global
│       ├── globals.css        # Styles globaux (Red Team)
│       ├── page.tsx           # Page de login
│       │
│       ├── 📂 lobby/
│       │   └── page.tsx       # Lobby multijoueur
│       │
│       ├── 📂 game/
│       │   └── page.tsx       # Interface de jeu
│       │
│       ├── 📂 victory/
│       │   └── page.tsx       # Écran de victoire
│       │
│       ├── 📂 components/
│       │   ├── MatrixRain.tsx          # Effet Matrix
│       │   └── VulnerableBrowser.tsx   # Navigateur simulé
│       │
│       └── 📂 utils/
│           └── sound.ts       # Gestionnaire de sons
│
├── 📂 docs/
│   ├── INDEX.md               # Index documentation
│   ├── QUICKSTART.md          # Guide rapide
│   ├── AEDI_DEFI_FAILLE.md   # Doc du défi
│   └── ...
│
├── README.md                  # Documentation principale
├── start.ps1                  # Script de démarrage
└── .gitignore                 # Fichiers ignorés

```

---

## 🔄 Flux de Données

### 1. Authentification

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Client  │ ──POST──│ Backend │ ──SQL───│ Database │
│         │ /login  │         │         │          │
└─────────┘         └─────────┘         └──────────┘
     │                   │                     │
     │  ← Cookie ←       │                     │
     │                   │  ← User ID ←        │
     │                   │                     │
```

### 2. Soumission de Flag

```
┌─────────┐         ┌─────────┐         ┌──────────┐
│ Client  │ ──POST──│ Backend │ ──SQL───│ Database │
│         │ /flag   │         │         │          │
└─────────┘         └─────────┘         └──────────┘
     │                   │                     │
     │                   │  1. Get Progress    │
     │                   │  2. Validate Flag   │
     │                   │  3. Update Score    │
     │                   │  4. Capture Flag    │
     │  ← Progress ←     │                     │
```

### 3. Lobby Temps Réel

```
┌─────────┐    WebSocket    ┌─────────┐
│ Client  │ ←──────────────→│ Socket  │
│    A    │                 │   IO    │
└─────────┘                 └─────────┘
                                 │
┌─────────┐                      │
│ Client  │ ←────────────────────┘
│    B    │     Broadcast
└─────────┘
```

---

## 🗄️ Modèle de Données

### Entités Principales

```
┌──────────┐       ┌───────────┐       ┌──────────┐
│  Users   │───┬───│ Sessions  │       │ Progress │
└──────────┘   │   └───────────┘       └──────────┘
               │                             │
               │   ┌────────────────┐        │
               └───│ Captured Flags │────────┘
                   └────────────────┘
```

### Relations

- **1 User** → **N Sessions** (plusieurs sessions possibles)
- **1 User** → **1 Progress** (une seule progression)
- **1 User** → **N Captured Flags** (plusieurs flags)

---

## 🔌 Communication Backend ↔ Frontend

### REST API (HTTP)

```javascript
// Frontend (Next.js)
const res = await fetch("http://localhost:3000/api/flag", {
  method: "POST",
  credentials: "include", // Important pour les cookies
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ flag: "FLAG{...}" }),
});
```

### WebSocket (Socket.IO)

```javascript
// Frontend
const socket = io("http://localhost:3000");
socket.emit("join-lobby", { username });
socket.on("lobby-update", (data) => {
  console.log("Players:", data.players);
});

// Backend
io.on("connection", (socket) => {
  socket.on("join-lobby", async (data) => {
    const players = await db.getActiveSessions();
    io.to("lobby").emit("lobby-update", { players });
  });
});
```

---

## 🛡️ Sécurité

### Sessions

- **Stockage** : Express-session + SQLite
- **Cookies** : HTTPOnly, SameSite=Lax
- **Expiration** : 24 heures
- **Nettoyage** : Automatique toutes les heures

### CORS

```javascript
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
```

### Validation

- **Flags** : Comparaison stricte (`===`)
- **Username** : Trim + vérification de type
- **Session** : Vérification à chaque requête

---

## ⚡ Performance

### Optimisations Backend

1. **Index DB** : Sur user_id, step_number
2. **Cleanup périodique** : Sessions expirées
3. **Connection pooling** : SQLite en mode WAL

### Optimisations Frontend

1. **Code splitting** : Next.js automatique
2. **Lazy loading** : Composants lourds
3. **Memoization** : React.memo sur composants

---

## 🔧 Technologies

### Backend

| Technologie     | Version | Usage           |
| --------------- | ------- | --------------- |
| Node.js         | 18+     | Runtime         |
| Express         | 4.18    | Framework web   |
| SQLite3         | 5.1     | Base de données |
| Socket.IO       | 4.7     | WebSocket       |
| Express-session | 1.17    | Sessions        |

### Frontend

| Technologie      | Version | Usage           |
| ---------------- | ------- | --------------- |
| Next.js          | 15      | Framework React |
| React            | 19      | UI Library      |
| Tailwind CSS     | 4       | Styling         |
| Framer Motion    | 11      | Animations      |
| Socket.IO Client | 4.7     | WebSocket       |

---

## 📊 Diagramme de Séquence - Login

```
Client          Backend         Database
  │               │                │
  │─── POST /api/login ───→│       │
  │               │                │
  │               │─── CREATE USER ──→│
  │               │                │
  │               │←─── User ID ────│
  │               │                │
  │               │─── CREATE SESSION ─→│
  │               │                │
  │               │←─── Session ID ───│
  │               │                │
  │←─── Set-Cookie ────│            │
  │               │                │
  │←─── JSON Response ─│            │
```

---

## 🚀 Déploiement

### Développement

```bash
# Terminal 1
npm start

# Terminal 2
cd frontend && npm run dev
```

### Production (Recommandations)

1. **Backend** : PM2 ou Docker
2. **Frontend** : Vercel ou Netlify
3. **Database** : PostgreSQL (migration depuis SQLite)
4. **CDN** : Cloudflare pour les assets

---

_Architecture conçue pour la Nuit de l'Info 2025_
