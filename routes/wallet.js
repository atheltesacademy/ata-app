const express = require('express');
const router = express.Router();
const wallet = require('../controllers/wallet');

// // Get wallet amount
router.get('/athlete_idwallet', wallet.getWalletAmount);

// Add money in the wallet
router.post('/add', wallet.addMoney);

// Get wallet transactions history
router.get('/transactions/athlete_id', wallet.getWalletTransactions);

module.exports = router;
