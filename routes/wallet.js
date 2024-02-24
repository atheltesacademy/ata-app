// routes/wallet.js
const express = require('express');
const router = express.Router();
const wallet = require('../controllers/wallet');
// const { authenticateUser } = require('../middlewares/auth');
// const { getWalletAmount, addMoney, getWalletTransactions } = require('../controllers/wallet');

// // Get wallet amount
router.get('/athlete_idwallet', wallet.getWalletAmount);

// Add money in the wallet
router.post('/add', wallet.addMoney);

// Get wallet transactions history
router.get('/transactions/athlete_id', wallet.getWalletTransactions);


// router.get('/:athlete_id', authenticateUserMiddleware,wallet, getWalletAmount);
// router.post('/add', authenticateUserMiddleware,wallet, addMoney);
// router.get('/transactions/athlete_id', authenticateUser,wallet, getWalletTransactions);


module.exports = router;
