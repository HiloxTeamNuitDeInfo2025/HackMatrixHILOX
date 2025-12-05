# 🔌 API Documentation - XSSHILOX

Documentation complète de l'API REST du backend XSSHILOX.

**Base URL** : `http://localhost:3000`

---

## 📋 Table des Matières

- [Authentification](#authentification)
- [Profil](#profil)
- [Jeu](#jeu)
- [Lobby](#lobby)
- [Leaderboard](#leaderboard)
- [Système](#système)

---

## 🔐 Authentification

### POST `/api/login`

Connexion d'un utilisateur et création de session.

**Request Body:**

```json
{
  "username": "string (required)"
}
```

**Response (200 OK):**

```json
{
  "ok": true,
  "username": "PlayerName",
  "message": "Login successful"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Username is required"
}
```

**Exemple cURL:**

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "TestUser"}' \
  -c cookies.txt
```

---

### POST `/api/logout`

Déconnexion et suppression de session.

**Response (200 OK):**

```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

**Exemple cURL:**

```bash
curl -X POST http://localhost:3000/api/logout \
  -b cookies.txt
```

---

## 👤 Profil

### GET `/api/profile`

Récupère le profil et la progression de l'utilisateur connecté.

**Headers:**

- Cookie: `session_id` (automatique)

**Response (200 OK):**

```json
{
  "ok": true,
  "username": "PlayerName",
  "progress": {
    "step": 3,
    "score": 2970,
    "completed": false,
    "flags": ["FLAG{STEP1_DEMO}", "FLAG{STEP2_REFLECTED_COOKIE}"]
  }
}
```

**Response (401 Unauthorized):**

```json
{
  "error": "Not authenticated"
}
```

**Exemple cURL:**

```bash
curl http://localhost:3000/api/profile \
  -b cookies.txt
```

---

## 🎮 Jeu

### POST `/api/flag`

Soumet un flag pour validation.

**Request Body:**

```json
{
  "flag": "string (required)"
}
```

**Response (200 OK) - Flag Correct:**

```json
{
  "ok": true,
  "message": "Flag accepted!",
  "progress": {
    "step": 4,
    "score": 3950,
    "flags": [
      "FLAG{STEP1_DEMO}",
      "FLAG{STEP2_REFLECTED_COOKIE}",
      "FLAG{STEP3_STORED}"
    ],
    "completed": false
  }
}
```

**Response (200 OK) - Flag Incorrect:**

```json
{
  "ok": false,
  "error": "Invalid flag",
  "progress": {
    "step": 3,
    "score": 2970,
    "flags": [...]
  }
}
```

**Response (401 Unauthorized):**

```json
{
  "error": "Not authenticated"
}
```

**Exemple cURL:**

```bash
curl -X POST http://localhost:3000/api/flag \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"flag": "FLAG{STEP1_DEMO}"}'
```

---

## 🏠 Lobby

### GET `/api/lobby`

Liste des joueurs actifs dans le lobby.

**Response (200 OK):**

```json
{
  "ok": true,
  "players": [
    {
      "username": "Player1",
      "step": 3,
      "score": 2970,
      "ready": false
    },
    {
      "username": "Player2",
      "step": 5,
      "score": 4920,
      "ready": false
    }
  ],
  "count": 2
}
```

**Exemple cURL:**

```bash
curl http://localhost:3000/api/lobby
```

---

## 🏆 Leaderboard

### GET `/api/leaderboard`

Classement des meilleurs joueurs.

**Response (200 OK):**

```json
{
  "ok": true,
  "leaderboard": [
    {
      "username": "TopPlayer",
      "score": 5850,
      "flagsCaptured": 6,
      "completed": true
    },
    {
      "username": "SecondPlace",
      "score": 4920,
      "flagsCaptured": 5,
      "completed": false
    }
  ]
}
```

**Exemple cURL:**

```bash
curl http://localhost:3000/api/leaderboard
```

---

## 🔧 Système

### GET `/`

Informations sur l'API.

**Response (200 OK):**

```json
{
  "name": "XSSHILOX API",
  "version": "2.0.0",
  "theme": "Red Team Alert",
  "status": "active",
  "database": "SQLite"
}
```

---

### GET `/health`

Vérification de l'état du serveur.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "activeSessions": 5,
  "timestamp": "2025-12-05T01:30:00.000Z"
}
```

**Response (500 Internal Server Error):**

```json
{
  "status": "unhealthy",
  "error": "Database connection failed"
}
```

---

## 📊 Codes de Statut HTTP

| Code | Signification         | Usage             |
| ---- | --------------------- | ----------------- |
| 200  | OK                    | Requête réussie   |
| 400  | Bad Request           | Données invalides |
| 401  | Unauthorized          | Non authentifié   |
| 500  | Internal Server Error | Erreur serveur    |

---

## 🔒 Authentification

Toutes les routes protégées nécessitent un cookie de session valide.

**Headers requis:**

```
Cookie: xsshilox.sid=s%3A...
```

Le cookie est automatiquement défini lors du login et envoyé avec `credentials: 'include'`.

---

## 🧪 Tests avec Postman

### Collection Postman

```json
{
  "info": {
    "name": "XSSHILOX API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/login",
        "body": {
          "mode": "raw",
          "raw": "{\"username\": \"TestUser\"}"
        }
      }
    },
    {
      "name": "Submit Flag",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/flag",
        "body": {
          "mode": "raw",
          "raw": "{\"flag\": \"FLAG{STEP1_DEMO}\"}"
        }
      }
    }
  ]
}
```

---

## 🐛 Gestion des Erreurs

Toutes les erreurs suivent ce format :

```json
{
  "error": "Description de l'erreur",
  "details": "Informations supplémentaires (optionnel)"
}
```

---

## 📝 Notes

- Les sessions expirent après 24 heures
- Le nettoyage automatique s'exécute toutes les heures
- Maximum 10 entrées dans le leaderboard
- Les flags sont sensibles à la casse

---

_Documentation API v2.0 - XSSHILOX_
