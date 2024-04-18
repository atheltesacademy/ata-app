const mongoose = require('mongoose');
const Wallet = require('../models/wallet');
const Athlete = require('../models/athlete');

// Get wallet amount
exports.getWalletAmount = async (req, res) => {
    try {
        const athlete_id = req.params.athlete_id;

         // Check if athlete exists with this athlete_id
         const athleteExists = await Athlete.exists({ _id: athlete_id });
         if (!athleteExists) {
             return res.status(404).json({ success: false, message: 'Athlete not found' });
         }
 
         // Fetch the wallet for the athlete
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

        // Check if athlete_id exists
        const athleteExists = await Athlete.exists({ _id: athlete_id });
        if (!athleteExists) {
            return res.status(404).json({ success: false, message: 'Athlete not found' });
        }
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
        wallet.amount += Number(amount);

        // Create a new transaction
        const transaction = {
            transaction_id: new mongoose.Types.ObjectId(), // Generate new ObjectId
            amount,
            type: amount > 0 ? "credit" : "debit"
        };

        // Push the transaction to the transactions array
        wallet.transactions.push(transaction);

        // Save the updated wallet
        await wallet.save();

        // Send success response with new balance
        res.status(200).json({ success: true, message: 'Amount added successfully', new_balance: wallet.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getWalletTransactions = async (req, res) => {
    try {
        // Retrieve athlete ID from request parameters
        const athlete_id = req.params.athlete_id; 
        // Check if athlete_id exists
        const athleteExists = await Athlete.exists({ _id: athlete_id });
        if (!athleteExists) {
            return res.status(404).json({ success: false, message: 'Athlete not found' });
        }
        // Find the wallet for the athlete
        let wallet = await Wallet.findOne({ athlete_id });

        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        
        // Return transactions directly from the wallet
        res.status(200).json({ success: true, transactions: wallet.transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


