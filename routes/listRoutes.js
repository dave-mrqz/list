const express = require('express');
const router = express.Router();

// TEMP TEST ROUTES — no controllers yet

// GET /lists/test
router.get('/test', (req, res) => {
  res.send('✅ listRoutes is working');
});

// GET /lists
router.get('/', (req, res) => {
  res.send('✅ Lists index route working');
});

module.exports = router;
