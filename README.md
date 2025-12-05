[![SQLite](https://img.shields.io/badge/SQLite-3-blue)](https://www.sqlite.org/)

---

## Description

**HackMatrixHILOX** est une plateforme gamifiée d'apprentissage des vulnérabilités XSS (Cross-Site Scripting) avec :

- ? **6 niveaux de challenges** progressifs
- ? **Base de données SQLite** pour la persistance
- ? **Temps réel** avec Socket.IO
- ? **Design rétro "Red Team"** immersif
- ? **Navigateur vulnérable** simulé
- ? **Terminal hacker** interactif

---

## Défi AEDI : La Faille la Plus Maligne

Ce projet démontre la **Stored XSS** (XSS Stockée), l'une des failles les plus dangereuses :

- **Persistante** : Le code malveillant est stocké en base de données
- **Propagation automatique** : Tous les utilisateurs sont affectés
- **Impact massif** : Une seule injection compromet des milliers d'utilisateurs

?? **Documentation complète** : `AEDI_DEFI_FAILLE.md`

---

## Installation

### Prérequis

- Node.js 18+ ([Télécharger](https://nodejs.org/))
- npm ou yarn

### Étapes

```bash
# 1. Cloner le projet
git clone https://github.com/HiloxTeamNuitDeInfo2025/AEDI-Project-Nuit-de-l-info.git
cd AEDI-Project-Nuit-de-l-info

# 2. Installer les dépendances backend
npm install

# 3. Installer les dépendances frontend
cd frontend
npm install
cd ..
```

---

## ?? Lancement

### Terminal 1 - Backend (Node.js + SQLite)

```bash
npm start
```

**Serveur** : http://localhost:3000

### Terminal 2 - Frontend (Next.js)

```bash
cd frontend
npm run dev
```

**Application** : http://localhost:3001

---

## ?? Structure du Projet

```
AEDI-Project-Nuit-de-l-info/
+-- database/
¦   +-- schema.sql          # Schéma SQLite
¦   +-- db.js               # Gestionnaire de base de données
¦   +-- HackMatrixHILOX.db         # Base de données (auto-créée)
+-- frontend/
¦   +-- app/
¦   ¦   +-- page.tsx        # Page de login
¦   ¦   +-- lobby/          # Lobby multijoueur
¦   ¦   +-- game/           # Interface de jeu
¦   ¦   +-- victory/        # Écran de victoire
¦   ¦   +-- components/
¦   ¦       +-- MatrixRain.tsx
¦   ¦       +-- VulnerableBrowser.tsx
¦   +-- package.json
+-- server.js               # Backend Node.js + Express
+-- package.json
+-- AEDI_DEFI_FAILLE.md    # Documentation du défi
+-- README.md
```

---

## ??? Base de Données SQLite

### Tables

**users** : Utilisateurs enregistrés

```sql
id, username, created_at, last_login
```

**sessions** : Sessions actives

```sql
id, user_id, created_at, expires_at
```

**progress** : Progression des joueurs

```sql
id, user_id, current_step, total_score, completed
```

**captured_flags** : Flags capturés

```sql
id, user_id, flag_text, step_number, points_earned, captured_at
```

### Vues

**leaderboard** : Classement des joueurs

```sql
username, total_score, current_step, flags_captured, completed
```

---

## ?? Challenges XSS

| Level | Type            | Description                      | Points |
| ----- | --------------- | -------------------------------- | ------ |
| 1     | Reflected XSS   | Barre de recherche non sécurisée | 1000   |
| 2     | Cookie Stealing | Vol de cookies de session        | 990    |
| 3     | **Stored XSS**  | Commentaires persistants ?      | 980    |
| 4     | DOM-Based XSS   | Manipulation client-side         | 970    |
| 5     | CSP Bypass      | Contournement de politique       | 960    |
| 6     | Filter Evasion  | Bypass de filtres WAF            | 950    |

---

## ?? API Endpoints

### Authentification

- `POST /api/login` - Connexion
- `GET /api/profile` - Profil utilisateur
- `POST /api/logout` - Déconnexion

### Jeu

- `POST /api/flag` - Soumettre un flag
- `GET /api/lobby` - Liste des joueurs
- `GET /api/leaderboard` - Classement

### Système

- `GET /` - Info API
- `GET /health` - Santé du serveur

---

## ?? Design

### Thème "Red Team Alert"

- **Couleurs** : Rouge (#ff0033), Orange (#ffb000)
- **Polices** : VT323, Press Start 2P, Share Tech Mono
- **Effets** : CRT scanlines, Matrix Rain rouge, glitch

### Composants

- **MatrixRain** : Effet de pluie de caractères
- **VulnerableBrowser** : Navigateur simulé avec failles
- **Terminal** : Console interactive pour hacker

---

## ??? Protection Contre les XSS

### 1. Échappement (Escaping)

```jsx
// ? Vulnérable
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ? Sécurisé
<div>{userInput}</div>
```

### 2. Content Security Policy (CSP)

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

### 3. Sanitization

```javascript
import DOMPurify from "dompurify";
const clean = DOMPurify.sanitize(dirty);
```

---

## ?? Tests

### Tester l'API avec cURL

**Login** :

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "TestUser"}' \
  -c cookies.txt
```

**Submit Flag** :

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"flag": "FLAG{STEP1_DEMO}"}'
```

**Leaderboard** :

```bash
curl http://localhost:3000/api/leaderboard
```

---

## ?? Dépannage

### Port 3000 déjà utilisé

```powershell
Get-Process -Name node | Stop-Process -Force
```

### Base de données corrompue

```bash
rm database/HackMatrixHILOX.db
npm start  # Recrée automatiquement
```

### Erreur SQLite

```bash
npm install sqlite3 --build-from-source
```

---

## ?? Statistiques

- **Lignes de code** : ~2500
- **Technologies** : 8 (Node.js, Express, SQLite, Socket.IO, Next.js, React, Tailwind, TypeScript)
- **Challenges** : 6 niveaux
- **Temps de développement** : 1 nuit ??

---

## ?? Équipe

**Hilox Team** - Nuit de l'Info 2025

---

## ?? Avertissement

Ce projet est **uniquement à des fins éducatives**. Les techniques démontrées ne doivent **jamais** être utilisées sur des systèmes réels sans autorisation. L'utilisation malveillante est **illégale**.

**Apprenez pour protéger, pas pour attaquer.**

---

## ?? Licence

MIT License - Libre d'utilisation pour l'éducation

---

_Développé avec ?? et ? pour la Nuit de l'Info 2025_
