import asyncHandler from '../middlewares/asyncHandler.js';
import fileUpload from'../middlewares/fileUpload.js';
import User from '../models/userModel.js';
import Investment from '../models/investmentModel.js';
import Admin from '../models/adminModel.js';

const createInvestment = (req, res) => {
    fileUpload(req, res, asyncHandler(async (err) => {
        if (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
        
        const admin = await Admin.findOne({ isAdmin: true });

        if (admin) {
            const user = req.user._id;
            const { amount } = req.body;
            const image = req.file.path;
            const profit = amount <= 10 ? admin.profitRange1 :
                amount > 10 && amount <=100 ? admin.profitRange2 :
                amount > 100 && amount <= 500 ? admin.profitRange3 :
                amount > 500 && amount <= 1000 ? admin.profitRange4 :
                admin.profitRange5;

            const investment = await Investment.create({
                user,
                amount,
                image,
                profit
            });
            
            if (investment) {
                res.status(201).json({
                    success: true,
                    amount: investment.amount
                });
            } else {
                res.status(400);
                throw new Error('Invalid investment data.');
            }
        }
    }));
};

const getUserInvestments = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const investments = status === 'All' ?
    await Investment.find({ user: req.user._id }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Investment.find({  user: req.user._id, isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    status === 'Rejected' ?
    await Investment.find({  user: req.user._id, isActive: false, isApproved: false }).sort({ createdAt: -1 }) :
    await Investment.find({  user: req.user._id, isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (investments) {        
        res.status(200).json({
            success: true,
            data: investments
        });
    } else {
        res.status(404);
        throw new Error('Investments not found.');
    }
});

const getInvestmentById = asyncHandler(async (req, res) => {
    const investment = await Investment.findById(req.params.id);
    const user = await User.findById(investment.user);

    if (investment && user) {
        res.status(200).json({
            success: true,
            data: {
                _id: investment._id,
                userId: investment.user,
                userName: user.name,
                userAccountNumber: user.accountNumber,
                userAccountType: user.accountType,
                amount: investment.amount,
                profit: investment.profit,
                isActive: investment.isActive,
                isApproved: investment.isApproved,
                image: investment.image
            }
        });
    } else {
        res.status(404);
        throw new Error('Investment not found.');
    }
});

const updatePendingInvestment = asyncHandler(async (req, res) => {
    const investment = await Investment.findById(req.params.id);
    const user = await User.findById(investment.user);
    
    if (investment && user) {
        const { amount, isActive, isApproved, status, profit } = req.body;

        investment.isActive = isActive;
        investment.isApproved = isApproved;

        user.wallet = (
            (status === 'Approved') ?
            (user.wallet + amount + profit) :
            user.wallet
        ) || user.wallet;

        user.investment = (
            (status === 'Approved') ?
            (user.investment + amount) :
            user.investment
        ) || user.investment;
        
        user.earning = (
            (status === 'Approved') ?
            (user.earning + amount + profit) :
            user.earning
        ) || user.earning;

        user.profit = (
            (status === 'Approved') ?
            (user.profit + profit) :
            user.profit
        ) || user.profit;

        await investment.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Investment updated seccessfully.'
        });
    } else {
        res.status(404);
        throw new Error('Investment or User not found.');
    }
});

const getAllInvestments = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const investments = status === 'All' ?
    await Investment.find({}).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Investment.find({ isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    status === 'Rejected' ?
    await Investment.find({ isActive: false, isApproved: false }).sort({ createdAt: -1 }) :
    await Investment.find({ isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (investments) {        
        res.status(200).json({
            success: true,
            data: investments
        });
    } else {
        res.status(404);
        throw new Error('Investments not found.');
    }
});

export {
    createInvestment,
    getUserInvestments,
    getInvestmentById,
    updatePendingInvestment,
    getAllInvestments,
};