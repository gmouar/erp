const express = require('express');
const { D1Database } = require('@cloudflare/d1'); // Import D1Database
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Connect to the Cloudflare D1 database
const db = new D1Database('e748083c-ce99-4edd-ad26-a64765077a36'); // Use the provided Database ID

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'Unassigned'
)`);

// User registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password]);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Registration failed', error: err.message });
  }
});

// User login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const row = await db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);
    if (row) {
      console.log('User logged in:', row); // Log the user data
      res.status(200).json({ message: 'Login successful', user: row, role: row.role });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(400).json({ message: 'Login failed', error: err.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
