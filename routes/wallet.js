const express = require('express');
const router = express.Router();
const wallet = require('../controllers/wallet');

// // Get wallet amount
router.get('/wallet/:athlete_id', checkTokenValidity, wallet.getWalletAmount);

// Add money in the wallet
router.post('/add', checkTokenValidity, wallet.addMoney);

// Get wallet transactions history
router.get('/wallet/transactions/:athlete_id', checkTokenValidity, wallet.getWalletTransactions);

module.exports = router;
