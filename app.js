const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const db = new Database('users.db');
const PORT = 3000;

// --- Middleware ---
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set("X-Frame-Options", "DENY");
  res.set("X-Content-Type-Options", "nosniff");
  next();
});
app.use(session({
  secret: 'hunter_secret',
  resave: false,
  saveUninitialized: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- Database Setup ---
function ensureUserTable() {
  db.prepare(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    firstname TEXT DEFAULT ''
  )`).run();
}
ensureUserTable();

// --- Helper Functions ---
function getUserByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function createUser(username, password, firstname = '') {
  return db.prepare('INSERT INTO users (username, password, firstname) VALUES (?, ?, ?)')
    .run(username, password, firstname);
}

function updateFirstname(username, firstname) {
  return db.prepare('UPDATE users SET firstname = ? WHERE username = ?').run(firstname, username);
}

// --- Admin User ---
const ADMIN_USER = {
  username: 'admin',
  password: 'very_secret_pass',
  apikey: 'ADMIN-API-KEY-xdjqowfiolwlfnkw2'
};

// --- Routes ---
// Home/Login Page
app.get('/', (req, res) => {
  res.render('index', { username: req.session.username || null });
});

// Login Handler
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    req.session.username = ADMIN_USER.username;
    return res.redirect('/');
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
  if (user) {
    req.session.username = username;
  }
  res.redirect('/');
});

// Registration Page
app.get('/register', (req, res) => {
  res.render('register');
});

// Registration Handler
app.post('/register', (req, res) => {
  const { username, password, firstname } = req.body;
  if (!username || !password) return res.redirect('/register');
  if (username === ADMIN_USER.username) {
    return res.redirect('/register');
  }
  try {
    createUser(username, password, firstname || '');
    req.session.username = username;
    res.redirect('/');
  } catch (e) {
    res.redirect('/register');
  }
});

// Profile Page
app.get('/profile', (req, res) => {
  if (!req.session.username) return res.redirect('/');
  if (req.session.username === ADMIN_USER.username) {
    return res.render('profile', { user: ADMIN_USER, isAdmin: true });
  }
  const user = getUserByUsername(req.session.username);
  if (!user) return res.redirect('/logout');
  res.render('profile', { user, isAdmin: false });
});

// Profile Update Handler
app.post('/profile', (req, res) => {
  if (!req.session.username) return res.redirect('/');
  const { firstname } = req.body;
  updateFirstname(req.session.username, firstname);
  res.redirect('/profile');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// --- Start Server ---
const http = require('http');

const server = http.createServer(app);
server.listen(PORT, '127.0.0.1', () => {
  console.log(`App running at http://127.0.0.1:${PORT}`);
});

# 27/07/2025