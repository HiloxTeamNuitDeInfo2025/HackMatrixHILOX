# 🎮 XSS BATTLE ARENA - Nuit de l'Info 2025

```
╔═══════════════════════════════════════════════════════════════╗
║  ██╗  ██╗███████╗███████╗    ██████╗  █████╗ ████████╗████████╗██╗     ███████╗
║  ╚██╗██╔╝██╔════╝██╔════╝    ██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
║   ╚███╔╝ ███████╗███████╗    ██████╔╝███████║   ██║      ██║   ██║     █████╗
║   ██╔██╗ ╚════██║╚════██║    ██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝
║  ██╔╝ ██╗███████║███████║    ██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗
║  ╚═╝  ╚═╝╚══════╝╚══════╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
║
║                    🏆 RETRO TERMINAL XSS CTF CHALLENGE 🏆
╚═══════════════════════════════════════════════════════════════╝
```

## 📖 Description

Un jeu de **Capture The Flag (CTF)** éducatif sur les vulnérabilités **XSS (Cross-Site Scripting)** avec une esthétique **rétro terminal Matrix** des années 90. Développé pour la **Nuit de l'Info 2025** par la **Hilox Team**.

### ✨ Caractéristiques

- 🎨 **Design Old-School** : Interface terminal CRT avec effets scanlines et glitch
- 🎯 **6 Niveaux de Challenges** : Du basique au CSP bypass
- 👥 **Mode Multijoueur** : Lobby en temps réel avec Socket.IO
- 🏆 **Système de Score** : Leaderboard et achievements
- 📚 **Éducatif** : Apprendre les XSS de manière ludique
- 🔒 **Sécurisé** : Environnement d'entraînement isolé

## 🛠️ Stack Technique

### Frontend (Next.js)

- **Framework** : Next.js 16 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS v4 + Custom CSS
- **Fonts** : VT323, Press Start 2P, Share Tech Mono
- **Real-time** : Socket.IO Client
- **Animations** : Framer Motion

### Backend (Express)

- **Framework** : Express.js
- **Real-time** : Socket.IO
- **Storage** : File-based JSON (demo)
- **Session** : Express Session

## 🚀 Installation & Démarrage

### Prérequis

- Node.js 18+
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repo-url>
cd AEDI-Project-Nuit-de-l-info
```

### 2. Installer les dépendances

#### Backend

```bash
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 3. Lancer l'application

#### Terminal 1 - Backend (Port 3000)

```bash
npm start
```

#### Terminal 2 - Frontend (Port 3001)

```bash
cd frontend
npm run dev
```

### 4. Accéder à l'application

Ouvrez votre navigateur sur : **http://localhost:3001**

## 🎮 Comment Jouer

### 1️⃣ Login

- Entrez votre nom d'utilisateur
- Ou utilisez le mode DEMO pour un nom aléatoire

### 2️⃣ Lobby

- Attendez d'autres joueurs (optionnel)
- Cliquez sur "SET READY"
- Le host lance la mission avec "LAUNCH MISSION"

### 3️⃣ Challenges

Complétez les 6 niveaux de XSS :

1. **Basic Injection** - Script tag simple
2. **Reflected XSS** - Cookie reflection
3. **Stored XSS** - Injection persistante
4. **DOM-based XSS** - Manipulation DOM
5. **CSP Bypass** - Contournement CSP
6. **Final Boss** - Combinaison de techniques

### 4️⃣ Victoire

- Consultez vos statistiques
- Rejouer ou retourner au lobby

## 🎨 Design Features

### Effets Visuels

- ✅ **CRT Screen Effect** : Scanlines animées
- ✅ **Flicker Animation** : Scintillement d'écran
- ✅ **Text Glow** : Effet néon Matrix
- ✅ **Pixel Borders** : Bordures rétro
- ✅ **Glitch Effect** : Distorsion visuelle
- ✅ **Terminal Cursor** : Curseur clignotant
- ✅ **Retro Buttons** : Boutons 3D old-school
- ✅ **Custom Scrollbar** : Scrollbar Matrix

### Palette de Couleurs

```css
--matrix-green: #00ff41    /* Vert Matrix principal */
--matrix-dark: #0d0208     /* Fond sombre */
--terminal-green: #33ff33  /* Vert terminal */
--terminal-amber: #ffb000  /* Ambre */
--terminal-red: #ff0000    /* Rouge alerte */
```

## 📁 Structure du Projet

```
AEDI-Project-Nuit-de-l-info/
├── frontend/                 # Application Next.js
│   ├── app/
│   │   ├── page.tsx         # Page login
│   │   ├── lobby/           # Page lobby
│   │   ├── game/            # Page jeu
│   │   ├── victory/         # Page victoire
│   │   ├── layout.tsx       # Layout principal
│   │   └── globals.css      # Styles globaux
│   ├── package.json
│   └── tsconfig.json
├── public/                   # Anciens fichiers HTML (legacy)
├── server.js                 # Serveur Express + Socket.IO
├── data.json                 # Stockage des données
└── package.json              # Dépendances backend
```

## 🔧 Configuration

### Port du Backend

Modifier dans `server.js` :

```javascript
const PORT = process.env.PORT || 3000;
```

### Port du Frontend

Modifier dans `frontend/package.json` :

```json
"dev": "next dev -p 3001"
```

### Socket.IO URL

Modifier dans les pages frontend :

```typescript
const socket = io("http://localhost:3000");
```

## 🎯 Flags des Challenges

Les flags sont définis dans `server.js` et `frontend/app/game/page.tsx` :

1. `FLAG{STEP1_DEMO}`
2. `FLAG{STEP2_REFLECTED_COOKIE}`
3. `FLAG{STEP3_STORED}`
4. `FLAG{STEP4_DOM}`
5. `FLAG{STEP5_CSP_BYPASS}`
6. `FLAG{STEP6_FINAL}`

## 🚨 Avertissement

⚠️ **POUR USAGE ÉDUCATIF UNIQUEMENT**

Ce projet est conçu pour l'apprentissage des vulnérabilités XSS dans un environnement contrôlé. Ne jamais utiliser ces techniques sur des systèmes réels sans autorisation.

## 👥 Équipe

**Hilox Team** - Nuit de l'Info 2025

## 📄 Licence

MIT License - Projet éducatif

## 🎓 Ressources

- [OWASP XSS Guide](https://owasp.org/www-community/attacks/xss/)
- [PortSwigger XSS](https://portswigger.net/web-security/cross-site-scripting)
- [Next.js Documentation](https://nextjs.org/docs)
- [Socket.IO Documentation](https://socket.io/docs/)

---

```
> SYSTEM READY
> AWAITING OPERATIVES...
> GOOD LUCK, HACKER!
```
