

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');

const router = express.Router();


// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, address, role } = req.body;
  // validations omitted for brevity (implement as shown earlier)
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
    [name, email, hash, address, role]
  );
  res.send({ message: 'User registered' });
});



// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  if (!rows.length) return res.status(401).send({ error: 'Invalid email' });
  const user = rows[0];
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ error: 'Invalid password' });
  }
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.send({ token, user });
});

// update-password
router.put('/update-password', async (req, res) => {
  const { userId, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);
  res.send({ message: 'Password updated' });
});


module.exports = router;
