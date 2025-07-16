const express = require('express');
const {
  seedUsers,
  getUsersAndRankings,
  claimPoints,
  addUser,
  getClaimHistory
} = require('../controllers/userController');



const router = express.Router();

// Endpoint to seed initial users
router.get('/seed', seedUsers);

// Get all users and their rankings
router.get('/', getUsersAndRankings);

// Claim points for a user
router.post('/claim', claimPoints);

//claim history router
router.get('/history', getClaimHistory);

// Add a new user
router.post('/add', addUser);

module.exports = router;
