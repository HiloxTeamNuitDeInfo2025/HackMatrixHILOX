# 🎬 Guide de Démonstration - HackMatrixHILOX

## 🚀 Démarrage Rapide pour la Démo

### Prérequis

- ✅ Node.js 18+ installé
- ✅ Git installé
- ✅ Terminal (PowerShell ou CMD)

---

## 📥 Installation (5 minutes)

### Étape 1 : Cloner le Repository

```bash
git clone https://github.com/HiloxTeamNuitDeInfo2025/HackMatrixHILOX.git
cd HackMatrixHILOX
```

### Étape 2 : Installer les Dépendances

**Backend** :

```bash
npm install
```

**Frontend** :

```bash
cd frontend
npm install
cd ..
```

---

## 🎮 Lancement (2 minutes)

### Option 1 : Script Automatique (Recommandé)

```powershell
.\start.ps1
```

✅ Lance automatiquement backend + frontend

### Option 2 : Manuel (2 Terminaux)

**Terminal 1 - Backend** :

```bash
npm start
```

Attendez le message :

```
✅ Connected to SQLite database
✅ Database schema initialized
📍 Server: http://localhost:3000
```

**Terminal 2 - Frontend** :

```bash
cd frontend
npm run dev
```

Attendez le message :

```
✓ Ready in 1156ms
- Local: http://localhost:3001
```

---

## 🎯 Scénario de Démonstration (10 minutes)

### 1️⃣ Page de Login (30 secondes)

**URL** : http://localhost:3001

**Points à montrer** :

- ✅ Design Red Team immersif
- ✅ Effet Matrix Rain rouge
- ✅ Terminal rétro CRT
- ✅ Thème "Alerte Rouge"

**Actions** :

```
1. Montrer l'interface
2. Cliquer sur "DEMO MODE"
3. Observer la connexion
```

---

### 2️⃣ Lobby Multijoueur (1 minute)

**Points à montrer** :

- ✅ Liste des joueurs connectés
- ✅ Scores en temps réel
- ✅ Socket.IO en action

**Actions** :

```
1. Ouvrir un nouvel onglet (Ctrl+Shift+N)
2. Se connecter avec un autre nom
3. Montrer la mise à jour en temps réel
```

---

### 3️⃣ Level 1 : Reflected XSS (1 minute)

**Objectif** : Démontrer une XSS basique

**Payload** :

```html
<script>
  alert("XSS!");
</script>
```

**Actions** :

```
1. Entrer le payload dans la barre de recherche
2. Observer l'exécution du script
3. Expliquer le danger
```

**Flag** : `FLAG{STEP1_DEMO}`

---

### 4️⃣ Level 2 : Cookie Stealing (1 minute)

**Objectif** : Vol de cookies de session

**Payload** :

```html
<img src="x" onerror="alert(document.cookie)" />
```

**Actions** :

```
1. Injecter le payload
2. Voir les cookies affichés
3. Expliquer l'impact (vol de session)
```

**Flag** : `FLAG{STEP2_REFLECTED_COOKIE}`

---

### 5️⃣ Level 3 : Stored XSS ⭐ (3 minutes)

**🎯 FAILLE PRINCIPALE DU DÉFI AEDI**

**Objectif** : XSS persistante dans le livre d'or

**Payload** :

```html
<script>
  alert("HACKED! Stored XSS");
</script>
```

**Actions** :

```
1. Montrer le formulaire de commentaire
2. Injecter le payload
3. Rafraîchir la page
4. Observer que le script s'exécute à chaque visite
5. Expliquer pourquoi c'est "la faille la plus maligne"
```

**Explication** :

```
✅ Persistante : Stockée en base de données
✅ Automatique : Tous les visiteurs sont affectés
✅ Massive : Une seule injection = milliers de victimes
```

**Flag** : `FLAG{STEP3_STORED}`

---

### 6️⃣ Terminal Hacker (1 minute)

**Commandes à montrer** :

```bash
> help           # Liste des commandes
> hint           # Indice pour le niveau actuel
> submit FLAG{...}  # Soumettre un flag
> clear          # Nettoyer le terminal
```

**Actions** :

```
1. Taper "help"
2. Taper "hint"
3. Soumettre un flag : submit FLAG{STEP1_DEMO}
4. Observer la validation
```

---

### 7️⃣ Leaderboard (30 secondes)

**Points à montrer** :

- ✅ Classement des joueurs
- ✅ Scores en temps réel
- ✅ Progression visible

**Actions** :

```
1. Naviguer vers /leaderboard
2. Montrer les joueurs classés
3. Expliquer le système de points
```

---

### 8️⃣ Base de Données SQLite (1 minute)

**Points à montrer** :

- ✅ Persistance des données
- ✅ Synchronisation automatique
- ✅ Tables structurées

**Actions** :

```
1. Ouvrir un terminal
2. Taper : curl http://localhost:3000/api/leaderboard
3. Montrer les données JSON
4. Expliquer la structure DB
```

---

## 🛡️ Protection Contre les XSS (2 minutes)

### Code Vulnérable

```jsx
// ❌ DANGEREUX
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### Code Sécurisé

```jsx
// ✅ SÉCURISÉ
<div>{userInput}</div>
```

### Content Security Policy

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
```

### Sanitization

```javascript
import DOMPurify from "dompurify";
const clean = DOMPurify.sanitize(dirty);
```

---

## 📊 Points Techniques à Mentionner

### Architecture

- ✅ **Backend** : Node.js + Express + SQLite
- ✅ **Frontend** : Next.js 16 + React 19 + Tailwind v4
- ✅ **Temps Réel** : Socket.IO
- ✅ **Base de Données** : SQLite avec schéma complet

### Sécurité

- ✅ Sessions HTTPOnly
- ✅ CORS configuré
- ✅ Validation côté serveur
- ✅ Sanitization (dans les solutions)

### Design

- ✅ Thème Red Team immersif
- ✅ Effets CRT authentiques
- ✅ Sons rétro (Web Audio API)
- ✅ Animations Matrix Rain

---

## 🎬 Script de Présentation (5 minutes)

### Introduction (30 secondes)

```
"Bonjour, je vous présente HackMatrixHILOX,
une plateforme d'apprentissage des vulnérabilités XSS
développée pour le défi AEDI de la Nuit de l'Info 2025.

Notre objectif : démontrer la faille XSS Stockée,
l'une des plus dangereuses du web."
```

### Démonstration (3 minutes)

```
1. "Voici l'interface de connexion avec notre thème Red Team"
2. "Je me connecte en mode DEMO..."
3. "Nous avons 6 niveaux de difficulté croissante"
4. "Passons directement au Level 3 : Stored XSS"
5. "J'injecte un script malveillant dans le livre d'or..."
6. "Comme vous voyez, le script s'exécute"
7. "Et il s'exécutera pour TOUS les futurs visiteurs"
8. "C'est pourquoi c'est la faille la plus maligne"
```

### Solutions (1 minute)

```
"Pour se protéger, trois méthodes principales :
1. Échappement automatique (React fait ça par défaut)
2. Content Security Policy
3. Sanitization avec DOMPurify

Notre plateforme montre à la fois le problème ET les solutions."
```

### Conclusion (30 secondes)

```
"HackMatrixHILOX combine :
- Pédagogie : 6 types de XSS différents
- Technique : Stack moderne (Next.js, SQLite, Socket.IO)
- Design : Expérience immersive Red Team
- Documentation : Guides complets pour reproduire et corriger

Merci !"
```

---

## 🧪 Tests Rapides Avant la Démo

### Checklist (2 minutes)

```bash
# 1. Backend fonctionne ?
curl http://localhost:3000/health
# → {"status":"healthy"}

# 2. Frontend accessible ?
# Ouvrir http://localhost:3001
# → Page de login visible

# 3. Login fonctionne ?
# Cliquer sur DEMO MODE
# → Redirection vers /lobby

# 4. XSS fonctionne ?
# Tester Level 1 avec <script>alert(1)</script>
# → Alert s'affiche

# 5. Base de données ?
curl http://localhost:3000/api/leaderboard
# → JSON avec données
```

---

## 🎯 Points Clés à Retenir

### Pourquoi Stored XSS est "Maligne" ?

1. **Persistante** : Code stocké en DB
2. **Automatique** : Pas d'interaction requise
3. **Massive** : Tous les utilisateurs touchés
4. **Invisible** : Difficile à détecter

### Valeur Pédagogique

1. **Apprentissage** : Voir concrètement comment ça marche
2. **Pratique** : Environnement sandbox sécurisé
3. **Solutions** : Apprendre à se protéger
4. **Gamification** : Motivation par le score

---

## 📞 Support Pendant la Démo

### Problèmes Courants

**Port déjà utilisé** :

```powershell
Get-Process -Name node | Stop-Process -Force
```

**Base de données corrompue** :

```bash
rm database/hackmatrixhilox.db
npm start  # Recrée automatiquement
```

**Frontend ne charge pas** :

```bash
cd frontend
rm -rf .next
npm run dev
```

---

## 🎁 Bonus : Démo Avancée

### Montrer le Code Source

```bash
# Ouvrir VS Code
code .

# Montrer :
1. server.js (backend)
2. frontend/app/page.tsx (login)
3. frontend/app/components/VulnerableBrowser.tsx (XSS)
4. database/schema.sql (structure DB)
```

### Montrer la Documentation

```
1. README.md - Vue d'ensemble
2. AEDI_DEFI_FAILLE.md - Explication détaillée
3. docs/ARCHITECTURE.md - Schémas techniques
4. docs/API.md - Endpoints
```

---

## ⏱️ Timeline Complète

| Temps | Action                   |
| ----- | ------------------------ |
| 0:00  | Introduction             |
| 0:30  | Montrer login            |
| 1:00  | Lobby multijoueur        |
| 2:00  | Level 1 (Reflected XSS)  |
| 3:00  | Level 3 (Stored XSS) ⭐  |
| 6:00  | Explication de la faille |
| 7:00  | Solutions de protection  |
| 8:00  | Architecture technique   |
| 9:00  | Questions / Réponses     |
| 10:00 | Fin                      |

---

**🎉 Vous êtes prêt pour une démo impressionnante !**

_Équipe Hilox - Nuit de l'Info 2025_  
_Repository_ : https://github.com/HiloxTeamNuitDeInfo2025/HackMatrixHILOX
