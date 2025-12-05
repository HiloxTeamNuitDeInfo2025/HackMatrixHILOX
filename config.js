/**
 * XSSHILOX - Configuration Centralisée
 * Tous les paramètres du projet en un seul endroit
 */

module.exports = {
  // Serveur
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0',
    environment: process.env.NODE_ENV || 'development'
  },

  // Base de données
  database: {
    path: process.env.DB_PATH || './database/xsshilox.db',
    schemaPath: './database/schema.sql'
  },

  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'xsshilox-red-team-secret-2025',
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
    cookieName: 'xsshilox.sid'
  },

  // CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
  },

  // Challenges
  challenges: {
    flags: {
      1: 'FLAG{STEP1_DEMO}',
      2: 'FLAG{STEP2_REFLECTED_COOKIE}',
      3: 'FLAG{STEP3_STORED}',
      4: 'FLAG{STEP4_DOM}',
      5: 'FLAG{STEP5_CSP_BYPASS}',
      6: 'FLAG{STEP6_FINAL}'
    },
    points: {
      1: 1000,
      2: 990,
      3: 980,
      4: 970,
      5: 960,
      6: 950
    },
    totalLevels: 6
  },

  // Leaderboard
  leaderboard: {
    maxEntries: 10,
    updateInterval: 30000 // 30 secondes
  },

  // Cleanup
  cleanup: {
    sessionInterval: 60 * 60 * 1000 // 1 heure
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'combined'
  }
};
