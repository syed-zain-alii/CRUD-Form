const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ---------- MYSQL ----------
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'users_system'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ MySQL Connected...');
});

// ---------- ROUTES ----------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// CREATE
app.post('/add-user', (req, res) => {
  const { name, phone, email, gender } = req.body;
  db.query(
    "INSERT INTO users (name, phone, email, gender) VALUES (?, ?, ?, ?)",
    [name, phone, email, gender],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'User added', id: result.insertId });
    }
  );
});

// READ ALL
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// READ ONE
app.get('/users/:id', (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).send(err);
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
      if (err) return res.status(500).send(err);
      res.json({ message: 'User updated' });
    }
  );
});

// DELETE
app.delete('/users/:id', (req, res) => {
  db.query("DELETE FROM users WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'User deleted' });
  });
});

// ---------- START ----------
app.listen(3000, () => {
  console.log('🚀 Server started on port 3000');
});
