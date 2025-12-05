// server.js
// Simple demo server for XSS CTF templates
// WARNING: file-based storage & in-memory session. Not for production.

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, 'data.json');
const PORT = process.env.PORT || 3000;

/* ---------- Helper: Simple file-based storage ---------- */
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}
/* ensure file exists */
if (!fs.existsSync(DATA_FILE)) writeData({ users: {}, progress: {}, finishes: {}, comments: [], lobby: [] });

/* ---------- Express app ---------- */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// session middleware (memory store: OK for demo only)
app.use(session({
  secret: 'dev-secret-xssctf', // change locally if you want
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 3600 * 1000 }
}));

// serve static demo UI
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- API: Auth (very simple) ---------- */

// POST /api/login  { username }
// returns profile
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== 'string') return res.status(400).json({ error: 'username required' });

  const data = readData();
  // create or update user
  const uid = uuidv4();
  data.users[username] = data.users[username] || { username, createdAt: Date.now() };

  // initialize progress if needed
  data.progress = data.progress || {};
  data.progress[username] = data.progress[username] || { step: 1, score: 0, flags: [], joinedAt: Date.now() };

  writeData(data);

  // session
  req.session.username = username;
  req.session.save(() => res.json({ ok: true, username }));
});

app.get('/api/profile', (req, res) => {
  if (!req.session.username) return res.status(401).json({ error: 'not logged in' });
  const data = readData();
  return res.json({ username: req.session.username, progress: data.progress[req.session.username] || {} });
});

/* ---------- API: leaderboard & flags ---------- */

// submit a flag for the current user
// POST /api/flag { flag }
app.post('/api/flag', (req, res) => {
  if (!req.session.username) return res.status(401).json({ error: 'not logged in' });
  const username = req.session.username;
  const { flag } = req.body;
  if (!flag) return res.status(400).json({ error: 'flag required' });

  const data = readData();
  data.progress = data.progress || {};
  const prog = data.progress[username] || { step: 1, score: 0, flags: [] };

  // expected flags for demo (should match client)
  const EXPECTED = {
    1: 'FLAG{STEP1_DEMO}',
    2: 'FLAG{STEP2_REFLECTED_COOKIE}',
    3: 'FLAG{STEP3_STORED}',
    4: 'FLAG{STEP4_DOM}',
    5: 'FLAG{STEP5_CSP_BYPASS}',
    6: 'FLAG{STEP6_FINAL}'
  };

  const expected = EXPECTED[prog.step];
  if (!expected) return res.status(400).json({ error: 'no step available' });

  if (flag === expected) {
    // correct
    prog.flags = prog.flags || [];
    if (!prog.flags.includes(flag)) prog.flags.push(flag);
    prog.score = (prog.score || 0) + Math.max(0, 1000 - prog.step * 10);
    prog.step = Math.min(Object.keys(EXPECTED).length + 1, prog.step + 1);
    data.progress[username] = prog;
    writeData(data);

    // notify via sockets about progress update
    io.emit('playerProgress', { username, progress: prog });

    // if finished (passed final step), record finish time
    if (prog.step > Object.keys(EXPECTED).length) {
      data.finishes = data.finishes || {};
      data.finishes[username] = { user: username, time: Date.now(), score: prog.score };
      writeData(data);
      io.emit('playerFinished', { username, finish: data.finishes[username] });
    }

    return res.json({ ok: true, progress: prog });
  } else {
    return res.status(400).json({ ok: false, error: 'Invalid flag' });
  }
});

app.get('/api/leaderboard', (req, res) => {
  const data = readData();
  const progress = data.progress || {};
  // convert to array & sort
  const rows = Object.keys(progress).map(u => ({ user: u, prog: progress[u] }));
  rows.sort((a, b) => {
    const astep = (a.prog.step || 1) - 1;
    const bstep = (b.prog.step || 1) - 1;
    if (astep !== bstep) return bstep - astep;
    return (b.prog.score || 0) - (a.prog.score || 0);
  });
  res.json({ leaderboard: rows, finishes: data.finishes || {} });
});

/* ---------- API: comments (stored XSS demo) ---------- */

app.post('/api/comment', (req, res) => {
  if (!req.session.username) return res.status(401).json({ error: 'not logged in' });
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'comment required' });
  const data = readData();
  data.comments = data.comments || [];
  // intentionally store raw text (this is a learning/demo platform)
  data.comments.push({ user: req.session.username, text, ts: Date.now() });
  writeData(data);
  io.emit('newComment', { user: req.session.username, text });
  res.json({ ok: true });
});

app.get('/api/comments', (req, res) => {
  const data = readData();
  res.json({ comments: data.comments || [] });
});

/* ---------- Lobby persistence and simple flow ---------- */
// Lobby tracks players and ready states
app.get('/api/lobby', (req, res) => {
  const data = readData();
  res.json({ lobby: data.lobby || [] });
});

/* ---------- Socket.IO real-time ---------- */
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // a user should announce themselves after connection
  socket.on('joinLobby', (payload) => {
    // payload: { username }
    const { username } = payload || {};
    if (!username) return;
    // store socket->username
    socket.data.username = username;

    const data = readData();
    data.lobby = data.lobby || [];
    if (!data.lobby.find(p => p.username === username)) {
      data.lobby.push({ username, ready: false, joinedAt: Date.now() });
      writeData(data);
    }
    // join socket room
    socket.join('lobbyRoom');
    io.to('lobbyRoom').emit('lobbyUpdate', data.lobby);
  });

  socket.on('setReady', (payload) => {
    const username = socket.data.username;
    const data = readData();
    data.lobby = data.lobby || [];
    data.lobby = data.lobby.map(p => p.username === username ? { ...p, ready: true } : p);
    writeData(data);
    io.to('lobbyRoom').emit('lobbyUpdate', data.lobby);
    // if all ready and at least 1 player, automatically start countdown if first is host
  });

  // host triggers countdown
  socket.on('startCountdown', () => {
    // notify all clients to begin 30s countdown; after countdown, server emits 'startGame'
    io.to('lobbyRoom').emit('startCountdown', { seconds: 30 });
    // schedule server-side game start after 30s
    setTimeout(() => {
      const data = readData();
      data.gameStart = Date.now();
      writeData(data);
      io.to('lobbyRoom').emit('startGame', { startAt: data.gameStart });
    }, 30000);
  });

  socket.on('leaveLobby', () => {
    const username = socket.data.username;
    const data = readData();
    data.lobby = (data.lobby || []).filter(p => p.username !== username);
    writeData(data);
    io.to('lobbyRoom').emit('lobbyUpdate', data.lobby);
  });

  socket.on('disconnect', () => {
    // do not remove from lobby automatically; leaving is explicit
    console.log('socket disconnected', socket.id);
  });
});

/* ---------- Start server ---------- */
server.listen(PORT, () => {
  console.log(`XSS CTF server running at http://localhost:${PORT} (PID ${process.pid})`);
});

/* ---------- Graceful shutdown to persist data (optional) ---------- */
process.on('SIGINT', () => {
  console.log('shutting down...');
  process.exit();
});
