# 🚨 XSSHILOX - Défi AEDI "La Faille la Plus Maligne"

## Équipe Hilox - Nuit de l'Info 2025

---

## 📋 Résumé du Projet

**XSSHILOX** est une plateforme d'entraînement gamifiée aux vulnérabilités XSS (Cross-Site Scripting) avec une esthétique rétro "Red Team". Le projet démontre de manière interactive et pédagogique comment exploiter et se protéger contre les failles XSS.

### 🎯 Objectif du Défi

Créer un site web avec une faille de sécurité volontaire, montrer comment elle peut être exploitée, et surtout, comment s'en protéger.

---

## 🔥 La Faille Choisie : **Stored XSS (XSS Stockée)**

### Pourquoi est-elle "maligne" ?

La **Stored XSS** est considérée comme l'une des failles les plus dangereuses car :

1.  **Persistance** : Le code malveillant est stocké dans la base de données
2.  **Propagation automatique** : Tous les utilisateurs qui consultent la page infectée sont touchés
3.  **Pas d'interaction requise** : Contrairement à la Reflected XSS, la victime n'a pas besoin de cliquer sur un lien piégé
4.  **Impact massif** : Une seule injection peut compromettre des milliers d'utilisateurs

C'est une **mine antipersonnel numérique** qui attend patiemment ses victimes.

---

## 🎮 Comment Tester la Faille

### Accès au Site

```bash
# 1. Cloner le projet
git clone [URL_DU_REPO]
cd AEDI-Project-Nuit-de-l-info

# 2. Installer les dépendances
npm install
cd frontend && npm install

# 3. Lancer le backend
npm start

# 4. Lancer le frontend (dans un autre terminal)
cd frontend && npm run dev

# 5. Accéder à l'application
http://localhost:3001
```

### Reproduction de la Faille (Level 3)

1.  **Se connecter** : Utilisez le mode DEMO ou entrez un nom d'utilisateur
2.  **Naviguer jusqu'au Level 3** : "STORED XSS"
3.  **Injecter le payload** dans le livre d'or (Guestbook) :
    ```html
    <script>
      alert("HACKED!");
    </script>
    ```
    ou pour voler les cookies :
    ```html
    <img src=x onerror=alert('Cookie:'+document.cookie)>
    ```
4.  **Observer** : Le script s'exécute immédiatement et serait exécuté pour tous les futurs visiteurs

### Autres Niveaux Disponibles

- **Level 1** : Reflected XSS (barre de recherche)
- **Level 2** : Cookie Stealing (logs admin)
- **Level 3** : Stored XSS (commentaires)
- **Level 4** : DOM-Based XSS (manipulation client-side)
- **Level 5** : CSP Bypass (contournement de politique de sécurité)
- **Level 6** : Filter Evasion (bypass de filtres WAF)

---

## 🛡️ Comment se Protéger

### 1. Échappement (Escaping) - Solution Principale

**❌ Code Vulnérable (utilisé dans notre démo) :**

```jsx
<div dangerouslySetInnerHTML={{ __html: userComment }} />
```

**✅ Code Sécurisé :**

```jsx
<div>{userComment}</div>
```

React échappe automatiquement les variables entre `{}`.

### 2. Content Security Policy (CSP)

Ajouter un en-tête HTTP qui restreint les sources de scripts :

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';
```

### 3. Sanitization avec DOMPurify

Si vous devez autoriser du HTML (éditeur riche) :

```javascript
import DOMPurify from "dompurify";
const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

### 4. Validation côté serveur

**Toujours** valider et nettoyer les entrées utilisateur côté serveur, jamais uniquement côté client.

---

## 🎨 Caractéristiques Techniques

### Frontend

- **Framework** : Next.js 15 (App Router)
- **Styling** : Tailwind CSS v4
- **Effets** : Framer Motion, Canvas API
- **Temps réel** : Socket.IO Client

### Backend

- **Runtime** : Node.js + Express
- **WebSocket** : Socket.IO
- **Stockage** : JSON file-based (démo)

### Design

- **Thème** : Red Team / Alerte Rouge
- **Esthétique** : Terminal rétro CRT avec effets scanlines
- **Polices** : VT323, Press Start 2P, Share Tech Mono
- **Sons** : Web Audio API (synthèse sonore)

---

## 📚 Valeur Pédagogique

### Ce que les développeurs apprennent :

1.  **Comprendre les XSS** : Voir concrètement comment une faille fonctionne
2.  **Identifier les vulnérabilités** : Reconnaître les patterns dangereux dans le code
3.  **Appliquer les protections** : Savoir quand utiliser l'échappement, CSP, sanitization
4.  **Tester en sécurité** : Environnement sandbox pour expérimenter sans risque

### Approche Gamifiée

- **6 niveaux progressifs** : Du basique à l'avancé
- **Système de points** : Motivation par le score
- **Flags à capturer** : Validation de la compréhension
- **Terminal interactif** : Immersion dans le rôle d'un pentester

---

## 🏆 Innovation

### Points Forts du Projet

1.  **Navigateur Simulé** : Voir les injections s'exécuter en temps réel
2.  **Terminal Hacker** : Interface ligne de commande pour soumettre les flags
3.  **Effets Sonores** : Feedback audio pour succès/échec
4.  **Design Immersif** : Thème "Red Alert" avec effets CRT authentiques
5.  **Documentation Complète** : Guide pas à pas pour reproduire et corriger

---

## 📞 Contact

**Équipe Hilox**

- Projet : XSSHILOX
- Événement : Nuit de l'Info 2025
- Défi : AEDI - "La faille la plus maligne"

---

## ⚠️ Avertissement

Ce projet est **uniquement à des fins éducatives**. Les techniques démontrées ne doivent **jamais** être utilisées sur des systèmes réels sans autorisation explicite. L'utilisation malveillante de ces connaissances est **illégale** et **contraire à l'éthique**.

**Utilisez ces connaissances pour construire des applications plus sûres, pas pour les attaquer.**

---

_Développé avec ❤️ par l'équipe Hilox pour la Nuit de l'Info 2025_
