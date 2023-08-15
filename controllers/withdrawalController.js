import asyncHandler from '../middlewares/asyncHandler.js';
import User from '../models/userModel.js';
import Withdrawal from '../models/withdrawalModel.js';

const createWithdrawal = asyncHandler(async (req, res) => {
    const { amount } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
        if (amount <= user.wallet) {
            user.wallet -= amount;
            
            const withdrawal = await Withdrawal.create({ user: req.user._id, amount });
            const updatedUser = await user.save();
        
            if (withdrawal && updatedUser) {
                res.status(201).json({
                    success: true,
                    amount: withdrawal.amount
                });
            } else {
                res.status(400);
                throw new Error('Invalid withdrawal data.');
            }
        } else {
            res.status(400);
            throw new Error('Withdrawal amount is greater than the amount in wallet.')
        }
    } else {
        res.status(404);
        throw new Error('User not found.')
    }
});

const getUserWithdrawals = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const withdrawals = status === 'All' ?
    await Withdrawal.find({ user: req.user._id }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Withdrawal.find({  user: req.user._id, isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    status === 'Rejected' ?
    await Withdrawal.find({  user: req.user._id, isActive: false, isApproved: false }).sort({ createdAt: -1 }) :
    await Withdrawal.find({  user: req.user._id, isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (withdrawals) {        
        res.status(200).json({
            success: true,
            data: withdrawals
        });
    } else {
        res.status(404);
        throw new Error('Withdrawals not found.');
    }
});

const getAllWithdrawals = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const withdrawals = status === 'All' ?
    await Withdrawal.find({}).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Withdrawal.find({ isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    status === 'Rejected' ?
    await Withdrawal.find({ isActive: false, isApproved: false }).sort({ createdAt: -1 }) :
    await Withdrawal.find({ isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (withdrawals) {        
        res.status(200).json({
            success: true,
            data: withdrawals
        });
    } else {
        res.status(404);
        throw new Error('Withdrawals not found.');
    }
});

const getWithdrawalById = asyncHandler(async (req, res) => {
    const withdrawal = await Withdrawal.findById(req.params.id).populate('user', 'name accountNumber accountType');
    
    if (withdrawal) {
        res.status(200).json({
            success: true,
            data: {
                _id: withdrawal._id,
                userId: withdrawal.user._id,
                userName: withdrawal.user.name,
                userAccountNumber: withdrawal.user.accountNumber,
                userAccountType: withdrawal.user.accountType,
                amount: withdrawal.amount,
                profit: withdrawal.profit,
                isActive: withdrawal.isActive,
                isApproved: withdrawal.isApproved
            }
        });
    } else {
        res.status(404);
        throw new Error('Withdrawals not found.');
    }
});

const updatePendingWithdrawal = asyncHandler(async (req, res) => {
    const withdrawal = await Withdrawal.findById(req.params.id);
    const user = await User.findById(withdrawal.user);
    
    if (withdrawal && user) {
        const { amount, isActive, isApproved, status } = req.body;

        withdrawal.isActive = isActive;
        withdrawal.isApproved = isApproved;

        user.wallet = (
            (status === 'Rejected') ?
            (user.wallet + amount) :
            user.wallet
        ) || user.wallet;

        user.withdrawal = (
            (status === 'Approved') ?
            (user.withdrawal + amount) :
            user.withdrawal
        ) || user.withdrawal;

        await withdrawal.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Withdrawal updated seccessfully.'
        });
    } else {
        res.status(404);
        throw new Error('Resource not found.');
    }
});

export {
    createWithdrawal,
    getUserWithdrawals,
    getWithdrawalById,
    updatePendingWithdrawal,
    getAllWithdrawals
};