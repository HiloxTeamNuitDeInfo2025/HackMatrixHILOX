/**
 * XSSHILOX - Node.js Backend with SQLite Database
 * Educational XSS CTF Platform
 * Nuit de l'Info 2025 - AEDI Challenge
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database/db');

const PORT = process.env.PORT || 3000;

// Expected flags for each level
const EXPECTED_FLAGS = {
  1: 'FLAG{STEP1_DEMO}',
  2: 'FLAG{STEP2_REFLECTED_COOKIE}',
  3: 'FLAG{STEP3_STORED}',
  4: 'FLAG{STEP4_DOM}',
  5: 'FLAG{STEP5_CSP_BYPASS}',
  6: 'FLAG{STEP6_FINAL}'
};

// Points for each level
const POINTS = {
  1: 1000,
  2: 990,
  3: 980,
  4: 970,
  5: 960,
  6: 950
};

/* ---------- Express App Setup ---------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// CORS Configuration
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'xsshilox-red-team-secret-2025',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 24 * 3600 * 1000, // 24 hours
    httpOnly: true,
    sameSite: 'lax'
  }
}));

/* ---------- API Endpoints ---------- */

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'XSSHILOX API',
    version: '2.0.0',
    theme: 'Red Team Alert',
    status: 'active',
    database: 'SQLite'
  });
});

// Health check
app.get('/health', async (req, res) => {
  try {
    const sessions = await db.getActiveSessions();
    res.json({
      status: 'healthy',
      activeSessions: sessions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Create or get user
    const user = await db.createUser(username.trim());
    
    // Create session
    const sessionId = uuidv4();
    await db.createSession(user.id, sessionId);
    
    // Store in Express session
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.sessionId = sessionId;
    
    req.session.save(() => {
      res.json({
        ok: true,
        username: user.username,
        message: 'Login successful'
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get user profile and progress
app.get('/api/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const progress = await db.getProgress(req.session.userId);
    const flags = await db.getCapturedFlags(req.session.userId);

    res.json({
      ok: true,
      username: req.session.username,
      progress: {
        step: progress.current_step,
        score: progress.total_score,
        completed: progress.completed === 1,
        flags: flags.map(f => f.flag_text)
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Submit a flag
app.post('/api/flag', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { flag } = req.body;
    if (!flag || typeof flag !== 'string') {
      return res.status(400).json({ error: 'Flag is required' });
    }

    // Get current progress
    const progress = await db.getProgress(req.session.userId);
    const currentStep = progress.current_step;

    // Check if already completed
    if (currentStep > Object.keys(EXPECTED_FLAGS).length) {
      return res.json({
        ok: false,
        error: 'All challenges completed',
        progress: {
          step: currentStep,
          score: progress.total_score,
          flags: (await db.getCapturedFlags(req.session.userId)).map(f => f.flag_text)
        }
      });
    }

    // Validate flag
    const expectedFlag = EXPECTED_FLAGS[currentStep];
    
    if (flag.trim() === expectedFlag) {
      // Correct flag!
      const points = POINTS[currentStep];
      
      // Capture flag
      await db.captureFlag(req.session.userId, flag.trim(), currentStep, points);
      
      // Update progress
      const newStep = currentStep + 1;
      const newScore = progress.total_score + points;
      const completed = newStep > Object.keys(EXPECTED_FLAGS).length;
      
      await db.updateProgress(req.session.userId, newStep, newScore, completed);
      
      // Get updated flags list
      const flags = await db.getCapturedFlags(req.session.userId);
      
      res.json({
        ok: true,
        message: 'Flag accepted!',
        progress: {
          step: newStep,
          score: newScore,
          flags: flags.map(f => f.flag_text),
          completed
        }
      });
    } else {
      // Incorrect flag
      const flags = await db.getCapturedFlags(req.session.userId);
      
      res.json({
        ok: false,
        error: 'Invalid flag',
        progress: {
          step: currentStep,
          score: progress.total_score,
          flags: flags.map(f => f.flag_text)
        }
      });
    }
  } catch (error) {
    console.error('Flag submission error:', error);
    res.status(500).json({ error: 'Failed to submit flag' });
  }
});

// Get lobby (active players)
app.get('/api/lobby', async (req, res) => {
  try {
    const players = await db.getActiveSessions();
    
    res.json({
      ok: true,
      players: players.map(p => ({
        username: p.username,
        step: p.current_step || 1,
        score: p.total_score || 0,
        ready: false // Simplified for now
      })),
      count: players.length
    });
  } catch (error) {
    console.error('Lobby error:', error);
    res.status(500).json({ error: 'Failed to get lobby' });
  }
});

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await db.getLeaderboard(10);
    
    res.json({
      ok: true,
      leaderboard: leaderboard.map(entry => ({
        username: entry.username,
        score: entry.total_score || 0,
        flagsCaptured: entry.flags_captured || 0,
        completed: entry.completed === 1
      }))
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ ok: true, message: 'Logged out successfully' });
  });
});

/* ---------- Socket.IO for Real-time Features ---------- */

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join-lobby', async (data) => {
    socket.join('lobby');
    const players = await db.getActiveSessions();
    io.to('lobby').emit('lobby-update', { players });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

/* ---------- Initialize Database and Start Server ---------- */

async function startServer() {
  try {
    console.log('🚀 Starting XSSHILOX Server...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Initialize database
    await db.initialize();
    
    // Cleanup expired sessions periodically
    setInterval(async () => {
      try {
        const deleted = await db.cleanupExpiredSessions();
        if (deleted > 0) {
          console.log(`🧹 Cleaned up ${deleted} expired sessions`);
        }
      } catch (error) {
        console.error('Session cleanup error:', error);
      }
    }, 60 * 60 * 1000); // Every hour
    
    // Start server
    server.listen(PORT, () => {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🎯 XSSHILOX - Red Team Edition');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`📍 Server: http://localhost:${PORT}`);
      console.log(`🗄️  Database: SQLite (./database/xsshilox.db)`);
      console.log(`🔴 Theme: Red Alert`);
      console.log(`🎯 Challenge: AEDI - La faille la plus maligne`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...');
  db.close();
  server.close(() => {
    console.log('👋 Server stopped');
    process.exit(0);
  });
});

// Start the server
startServer();
