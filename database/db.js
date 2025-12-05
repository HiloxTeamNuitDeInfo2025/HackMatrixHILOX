/**
 * XSSHILOX - Database Manager
 * SQLite database operations for the XSS CTF platform
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class DatabaseManager {
  constructor(dbPath = './database/xsshilox.db') {
    this.dbPath = dbPath;
    this.db = null;
  }

  /**
   * Initialize database connection and create tables
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      // Ensure database directory exists
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Connect to database
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('❌ Database connection error:', err);
          reject(err);
          return;
        }
        console.log('✅ Connected to SQLite database');
      });

      // Read and execute schema
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      
      if (!fs.existsSync(schemaPath)) {
        console.error('❌ Schema file not found:', schemaPath);
        reject(new Error('Schema file not found'));
        return;
      }
      
      const schema = fs.readFileSync(schemaPath, 'utf8');

      this.db.exec(schema, (err) => {
        if (err) {
          console.error('❌ Schema creation error:', err);
          reject(err);
          return;
        }
        console.log('✅ Database schema initialized');
        resolve();
      });
    });
  }

  /**
   * Create or get user
   */
  async createUser(username) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO users (username) 
        VALUES (?)
        ON CONFLICT(username) DO UPDATE SET last_login = CURRENT_TIMESTAMP
        RETURNING id, username
      `;

      this.db.get(query, [username], (err, row) => {
        if (err) {
          // Fallback for older SQLite versions
          this.db.get('SELECT id, username FROM users WHERE username = ?', [username], (err2, existing) => {
            if (existing) {
              this.db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [existing.id]);
              resolve(existing);
            } else {
              this.db.run('INSERT INTO users (username) VALUES (?)', [username], function(err3) {
                if (err3) reject(err3);
                else resolve({ id: this.lastID, username });
              });
            }
          });
        } else {
          resolve(row);
        }
      });
    });
  }

  /**
   * Create session for user
   */
  async createSession(userId, sessionId) {
    return new Promise((resolve, reject) => {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const query = `
        INSERT INTO sessions (id, user_id, expires_at)
        VALUES (?, ?, ?)
      `;

      this.db.run(query, [sessionId, userId, expiresAt.toISOString()], (err) => {
        if (err) reject(err);
        else resolve({ sessionId, userId, expiresAt });
      });
    });
  }

  /**
   * Get user by session ID
   */
  async getUserBySession(sessionId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.id, u.username, s.expires_at
        FROM users u
        JOIN sessions s ON u.id = s.user_id
        WHERE s.id = ? AND s.expires_at > datetime('now')
      `;

      this.db.get(query, [sessionId], (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      });
    });
  }

  /**
   * Get or create user progress
   */
  async getProgress(userId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM progress WHERE user_id = ?`;

      this.db.get(query, [userId], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          resolve(row);
        } else {
          // Create initial progress
          this.db.run(
            'INSERT INTO progress (user_id) VALUES (?)',
            [userId],
            function(err2) {
              if (err2) reject(err2);
              else resolve({ id: this.lastID, user_id: userId, current_step: 1, total_score: 0, completed: 0 });
            }
          );
        }
      });
    });
  }

  /**
   * Update user progress
   */
  async updateProgress(userId, step, score, completed = false) {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE progress 
        SET current_step = ?, total_score = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `;

      this.db.run(query, [step, score, completed ? 1 : 0, userId], (err) => {
        if (err) reject(err);
        else resolve({ step, score, completed });
      });
    });
  }

  /**
   * Capture a flag
   */
  async captureFlag(userId, flagText, stepNumber, points) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO captured_flags (user_id, flag_text, step_number, points_earned)
        VALUES (?, ?, ?, ?)
      `;

      this.db.run(query, [userId, flagText, stepNumber, points], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, flagText, stepNumber, points });
      });
    });
  }

  /**
   * Get captured flags for user
   */
  async getCapturedFlags(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT flag_text, step_number, points_earned, captured_at
        FROM captured_flags
        WHERE user_id = ?
        ORDER BY captured_at ASC
      `;

      this.db.all(query, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 10) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM leaderboard LIMIT ?`;

      this.db.all(query, [limit], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Get all active sessions (for lobby)
   */
  async getActiveSessions() {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT u.username, p.current_step, p.total_score
        FROM sessions s
        JOIN users u ON s.user_id = u.id
        LEFT JOIN progress p ON u.id = p.user_id
        WHERE s.expires_at > datetime('now')
        ORDER BY p.total_score DESC
      `;

      this.db.all(query, [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows || []);
      });
    });
  }

  /**
   * Delete expired sessions
   */
  async cleanupExpiredSessions() {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM sessions WHERE expires_at <= datetime('now')`;

      this.db.run(query, [], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) console.error('Error closing database:', err);
        else console.log('Database connection closed');
      });
    }
  }
}

module.exports = new DatabaseManager();
