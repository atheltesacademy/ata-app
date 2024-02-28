const Wallet = require('../models/wallet');

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
        const wallet = await Wallet.findOneAndUpdate(
            { athlete_id },
            { $inc: { amount: amount } },
            { new: true }
        );

        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        const transaction = {
            transaction_id: mongoose.Types.ObjectId(),
            amount,
            type: 'credit'
        };
        wallet.transactions.push(transaction);
        await wallet.save();
        res.status(201).json({ success: true, message: 'Amount added successfully', new_balance: wallet.amount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get wallet transactions history
exports.getWalletTransactions = async (req, res) => {
    try {
        const athlete_id = req.params.athlete_id;
        const wallet = await Wallet.findOne({ athlete_id });
        if (!wallet) {
            return res.status(404).json({ success: false, message: 'Wallet not found' });
        }
        res.status(200).json({ success: true, transactions: wallet.transactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
