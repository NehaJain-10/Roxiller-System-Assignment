

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../utils/db');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// Dashboard stats
router.get('/dashboard', verifyToken, async (req, res) => {
  const [[u]] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
  const [[s]] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
  const [[r]] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');
  res.send({
    totalUsers: u.totalUsers,
    totalStores: s.totalStores,
    totalRatings: r.totalRatings
  });
});

// List users
router.get('/users', verifyToken, async (req, res) => {
  const [users] = await db.query(
    'SELECT id,name,email,address,role FROM users'
  );
  res.send(users);
});

// Add user
router.post('/users', verifyToken, async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users (name,email,password,address,role) VALUES (?,?,?,?,?)',
    [name, email, hash, address, role]
  );
  res.send({ message: 'User added' });
});

// List stores with avg rating
router.get('/stores', verifyToken, async (req, res) => {
  const [stores] = await db.query(`
    SELECT s.*, ROUND(AVG(r.rating),1) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id=r.store_id
    GROUP BY s.id
  `);
  res.send(stores);
});

// Add store
router.post('/stores', verifyToken, async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  await db.query(
    'INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)',
    [name, email, address, owner_id]
  );
  res.send({ message: 'Store added' });
});

module.exports = router;
