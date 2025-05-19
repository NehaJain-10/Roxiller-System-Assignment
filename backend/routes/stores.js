

const express = require('express');
const db = require('../utils/db');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// All stores w/ avg rating
router.get('/', verifyToken, async (req, res) => {
  const [stores] = await db.query(`
    SELECT s.*, ROUND(AVG(r.rating),1) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id=r.store_id
    GROUP BY s.id
  `);
  res.send(stores);
});

// Submit/update rating
router.post('/rate', verifyToken, async (req, res) => {
  const { userId, storeId, rating } = req.body;
  await db.query(`
    INSERT INTO ratings (user_id,store_id,rating)
    VALUES (?,?,?)
    ON DUPLICATE KEY UPDATE rating=VALUES(rating)
  `, [userId, storeId, rating]);
  res.send({ message: 'Rating submitted' });
});

// Owner dashboard
router.get('/owner/:ownerId', verifyToken, async (req, res) => {
  const ownerId = req.params.ownerId;
  const [stores] = await db.query(`
    SELECT s.id,s.name,s.address,ROUND(AVG(r.rating),1) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id=r.store_id
    WHERE s.owner_id=?
    GROUP BY s.id
  `, [ownerId]);
  if (!stores.length) return res.status(404).send({ message: 'No store' });
  const storeId = stores[0].id;
  const [users] = await db.query(`
    SELECT u.name,u.email,r.rating
    FROM ratings r
    JOIN users u ON r.user_id=u.id
    WHERE r.store_id=?
  `, [storeId]);
  res.send({ store: stores[0], users });
});

// Get ratings submitted by a specific user
router.get('/ratings/user/:userId', verifyToken, async (req, res) => {
  const userId = req.params.userId;
  const [ratings] = await db.query(
    'SELECT store_id, rating FROM ratings WHERE user_id = ?',
    [userId]
  );
  res.send(ratings);
});


module.exports = router;
