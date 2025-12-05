# 🚀 Guide de Démarrage Rapide - XSS Battle Arena

## ⚡ Lancement Rapide

### Option 1 : Deux terminaux séparés (Recommandé)

#### Terminal 1 - Backend

```bash
# Depuis la racine du projet
npm start
```

Le backend démarre sur **http://localhost:3000**

#### Terminal 2 - Frontend

```bash
# Depuis la racine du projet
cd frontend
npm run dev
```

Le frontend démarre sur **http://localhost:3001**

### Option 2 : Script de lancement automatique

#### Windows (PowerShell)

```powershell
# Créer un fichier start.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
Start-Sleep -Seconds 2
Set-Location frontend
npm run dev
```

#### Linux/Mac (Bash)

```bash
# Créer un fichier start.sh
#!/bin/bash
npm start &
cd frontend
npm run dev
```

## 📋 Checklist de Démarrage

- [ ] Node.js 18+ installé
- [ ] Dépendances backend installées (`npm install` à la racine)
- [ ] Dépendances frontend installées (`cd frontend && npm install`)
- [ ] Port 3000 disponible (backend)
- [ ] Port 3001 disponible (frontend)

## 🔍 Vérification

### Backend OK si vous voyez :

```
XSS CTF server running at http://localhost:3000 (PID XXXXX)
```

### Frontend OK si vous voyez :

```
✓ Ready in XXXXms
- Local:   http://localhost:3001
```

## 🌐 Accès

Une fois les deux serveurs lancés :

1. Ouvrez votre navigateur
2. Allez sur **http://localhost:3001**
3. Profitez du XSS Battle Arena ! 🎮

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier si le port 3000 est occupé
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Linux/Mac

# Tuer le processus si nécessaire
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Linux/Mac
```

### Le frontend ne démarre pas

```bash
# Supprimer .next et node_modules
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Erreur Socket.IO

- Vérifier que le backend est bien lancé sur le port 3000
- Vérifier que l'URL dans le code frontend est correcte : `http://localhost:3000`

## 📦 Structure des Ports

| Service  | Port | URL                   |
| -------- | ---- | --------------------- |
| Backend  | 3000 | http://localhost:3000 |
| Frontend | 3001 | http://localhost:3001 |

## 🎯 Prochaines Étapes

1. Créer un compte sur la page de login
2. Rejoindre le lobby
3. Commencer les challenges XSS
4. Capturer tous les flags ! 🚩

---

```
> SYSTEM INITIALIZED
> ALL SYSTEMS OPERATIONAL
> READY TO HACK!
```

**Bon courage, hacker ! 💚**
