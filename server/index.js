require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

const users = new Map([
  ['hr@gmail.com', { username: 'hr@gmail.com', password: 'hr123', role: 'HR', id: 1 }],
  ['admin@gmail.com', { username: 'admin@gmail.com', password: 'admin123', role: 'Superuser', id: 2 }]
]);

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
};

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint with error handling
app.get('/api/health', (req, res, next) => {
  try {
    res.json({ 
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Add registration endpoint
app.post('/api/register', (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    if (users.has(username)) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Store new user
    users.set(username, {
      username,
      email,
      password, // In production, hash the password!
      role: 'Unassigned',
      id: Date.now()
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful'
    });
  } catch (error) {
    next(error);
  }
});

// Auth endpoints with proper error handling
app.post('/api/login', (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // Mock login validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = users.get(username);
    if (user && user.password === password) {
      res.cookie('sessionId', user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      return res.json({ 
        success: true,
        user: { 
          id: user.id, 
          username: user.username,
          email: user.email 
        },
        role: user.role
      });
    }

    res.status(401).json({ 
      success: false,
      message: 'Invalid credentials' 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/check-auth', (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId === '123456') {
      return res.json({ 
        user: { id: 1, username: 'admin' }, 
        role: 'HR' 
      });
    }

    res.json({ user: null, role: 'Unassigned' });
  } catch (error) {
    next(error);
  }
});

app.post('/api/logout', (req, res, next) => {
  try {
    res.clearCookie('sessionId');
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

// Start server with error handling
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
