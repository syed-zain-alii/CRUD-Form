// -------------------- IMPORTS --------------------
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

const app = express();

// -------------------- MIDDLEWARE --------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// -------------------- MYSQL CONNECTION --------------------
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Railway DB host
  user: process.env.DB_USER,       // Railway DB user
  password: process.env.DB_PASSWORD, // Railway DB password
  database: process.env.DB_NAME,     // Database name (users_system)
  port: process.env.DB_PORT || 3306  // Default MySQL port
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    process.exit(1); // Stop server if DB not connected
  }
  console.log('✅ MySQL Connected...');
});

// -------------------- ROUTES --------------------

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CREATE USER
app.post('/add-user', (req, res) => {
  const { name, phone, email, gender } = req.body;
  const query = "INSERT INTO users (name, phone, email, gender) VALUES (?, ?, ?, ?)";
  db.query(query, [name, phone, email, gender], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json({ message: '✅ User added successfully', id: result.insertId });
  });
});

// READ ALL USERS
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(results);
  });
});

// READ SINGLE USER
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(results[0]);
  });
});

// UPDATE USER
app.put('/users/:id', (req, res) => {
  const { name, phone, email, gender } = req.body;
  db.query(
    "UPDATE users SET name = ?, phone = ?, email = ?, gender = ? WHERE id = ?",
    [name, phone, email, gender, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
      res.json({ message: '✅ User updated successfully' });
    }
  );
});

// DELETE USER
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.json({ message: '✅ User deleted successfully' });
  });
});

// -------------------- START SERVER --------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on port ${PORT}`);
});
