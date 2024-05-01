const express = require('express');
const router = express.Router();
const wallet = require('../controllers/wallet');

// // Get wallet amount
router.get('/wallet/:athlete_id', wallet.getWalletAmount);

// Add money in the wallet
router.post('/wallet/add', wallet.addMoney);

// Get wallet transactions history
router.get('/wallet/transactions/:athlete_id', wallet.getWalletTransactions);

module.exports = router;