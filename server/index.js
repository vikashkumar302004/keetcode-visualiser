import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors());
app.use(express.json());

// Persistent database path
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory & file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Simple Hashing Helper
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'keetcode_salt_2026').digest('hex');
}

// Generate Auth Token
function generateToken(userId) {
  const payload = JSON.stringify({ userId, timestamp: Date.now() });
  return Buffer.from(payload).toString('base64');
}

// Decode Auth Token
function verifyToken(token) {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    return decoded.userId;
  } catch (e) {
    return null;
  }
}

// Load Users Database
function getUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUser = [{
      id: 'user_default_1',
      name: 'Vikash',
      email: 'vikash@keetcode.dev',
      password: hashPassword('password123'),
      createdAt: new Date().toISOString()
    }];
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUser, null, 2));
    return defaultUser;
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

// Save Users Database
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- API ROUTES ---

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Keetcode Authentication Backend', time: new Date().toISOString() });
});

// Register API
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    return res.status(400).json({ success: false, error: 'An account with this email already exists.' });
  }

  // Create new user
  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    password: hashPassword(password),
    provider: 'email',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const token = generateToken(newUser.id);
  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});

// Login API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();
  const hashedPassword = hashPassword(password);

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === hashedPassword);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    message: 'Logged in successfully!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// Google OAuth Sign In / Register Endpoint
app.post('/api/auth/google', (req, res) => {
  const { name, email, googleId, picture } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required for Google Sign-In.' });
  }

  const users = getUsers();
  const normalizedEmail = email.toLowerCase().trim();

  let user = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    // Automatically register user if first time logging in with Google
    user = {
      id: `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name || email.split('@')[0],
      email: normalizedEmail,
      googleId: googleId || 'google_oauth_id',
      picture: picture || null,
      provider: 'google',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
  }

  const token = generateToken(user.id);
  res.json({
    success: true,
    message: 'Google Sign-In successful!',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture
    }
  });
});

// Get Current User (Me) Endpoint
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No authorization token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);

  if (!userId) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token.' });
  }

  const users = getUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found.' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture || null
    }
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Keetcode Backend API] Running on http://localhost:${PORT}`);
});
