const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

const app = express();

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- MYSQL CONNECTION ----------
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err);
    process.exit(1); // Stop app if DB fails
  }
  console.log('✅ MySQL Connected...');
});

// ---------- ROUTES ----------

// Home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CREATE
app.post('/add-user', (req, res) => {
  const { name, phone, email, gender } = req.body;

  const query = "INSERT INTO users (name, phone, email, gender) VALUES (?, ?, ?, ?)";

  db.query(query, [name, phone, email, gender], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    res.json({
      message: 'User added successfully',
      id: result.insertId
    });
  });
});

// READ ALL
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// READ ONE
app.get('/users/:id', (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// UPDATE
app.put('/users/:id', (req, res) => {
  const { name, phone, email, gender } = req.body;

  db.query(
    "UPDATE users SET name=?, phone=?, email=?, gender=? WHERE id=?",
    [name, phone, email, gender, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'User updated successfully' });
    }
  );
});

// DELETE
app.delete('/users/:id', (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted successfully' });
  });
});

// ---------- START SERVER ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
