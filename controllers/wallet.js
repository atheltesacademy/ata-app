const Wallet = require('../models/wallet');
const mongoose = require('mongoose');

// Get wallet amount
exports.getWalletAmount = async (req, res) => {
    try {
        const athlete_id = req.params.athlete_id;
        const wallet = await Wallet.findOne({ athlete_id });
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        res.status(200).json({ success: true, amount: wallet.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// Add money in the wallet
exports.addMoney = async (req, res) => {
    try {
        const { athlete_id, amount } = req.body;

        // Find the wallet for the athlete
        let wallet = await Wallet.findOne({ athlete_id });

        // If wallet does not exist, create a new one
        if (!wallet) {
            wallet = new Wallet({
                athlete_id,
                amount: 0, // Set initial amount to 0
                transactions: [] // Initialize transactions array
            });
        }
        // Update the wallet amount
        wallet.amount += amount;

        // Create a new transaction
        const transaction = {
            transaction_id: new mongoose.Types.ObjectId(), // Generate new ObjectId
            amount,
            type: 'credit'
        };

        // Push the transaction to the transactions array
        wallet.transactions.push(transaction);

        // Save the updated wallet
        await wallet.save();

        // Send success response with new balance
        res.status(201).json({ success: true, message: 'Amount added successfully', new_balance: wallet.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getWalletTransactions = async (req, res) => {
    try {
        // Retrieve athlete ID from request body
        const athlete_id = req.body.athlete_id; // Modify this according to the request structure

        // Find the wallet for the specified athlete ID
        const wallet = await Wallet.findOne({ athlete_id });

        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }

        // Extract transactions from the wallet
        const transactions = wallet.transactions.map(transaction => ({
            transaction_id: transaction.transaction_id,
            amount: transaction.amount,
            type: transaction.type,
            timestamp: transaction.timestamp
        }));

        res.status(200).json({ success: true, transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

