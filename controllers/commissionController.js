import asyncHandler from '../middlewares/asyncHandler.js';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Commission from '../models/commissionModel.js';

const getUserReferralCommissions = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const referralCommissions = status === 'All' ?
    await Commission.find({ to: req.user._id, commissionType: 'Referral' }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Commission.find({  to: req.user._id, commissionType: 'Referral', isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    await Commission.find({  to: req.user._id, commissionType: 'Referral', isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (referralCommissions) {        
        res.status(200).json({
            success: true,
            data: referralCommissions
        });
    } else {
        res.status(404);
        throw new Error('Referral commissions not found.');
    }
});
const getUserTeamCommissions = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const teamCommissions = status === 'All' ?
    await Commission.find({ to: req.user._id, commissionType: 'Team' }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Commission.find({  to: req.user._id, commissionType: 'Team', isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    await Commission.find({  to: req.user._id, commissionType: 'Team', isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (teamCommissions) {        
        res.status(200).json({
            success: true,
            data: teamCommissions
        });
    } else {
        res.status(404);
        throw new Error('Team commissions not found.');
    }
});

const getAllReferralCommissions = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const commissions = status === 'All' ?
    await Commission.find({ commissionType: 'Referral' }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Commission.find({ commissionType: 'Referral', isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    await Commission.find({ commissionType: 'Referral', isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (commissions) {        
        res.status(200).json({
            success: true,
            data: commissions
        });
    } else {
        res.status(404);
        throw new Error('Referral commissions not found.');
    }
});

const getAllTeamCommissions = asyncHandler(async (req, res) => {
    const status = req.params.status;

    const commissions = status === 'All' ?
    await Commission.find({ commissionType: 'Team' }).sort({ createdAt: -1 }) :
    status === 'Approved' ?
    await Commission.find({ commissionType: 'Team', isActive: false, isApproved: true }).sort({ createdAt: -1 }) :
    await Commission.find({ commissionType: 'Team', isActive: true, isApproved: false }).sort({ createdAt: -1 })

    if (commissions) {        
        res.status(200).json({
            success: true,
            data: commissions
        });
    } else {
        res.status(404);
        throw new Error('Team commissions not found.');
    }
});

const getCommissionById = asyncHandler(async (req, res) => {
    const referralCommission = await Commission.findById(req.params.id);
    const user = await User.findById(referralCommission.to);

    if (referralCommission && user) {
        res.status(200).json({
            success: true,
            data: {
                _id: referralCommission._id,
                commissionType: referralCommission.commissionType,
                from: referralCommission.from,
                userId: referralCommission.to,
                userName: user.name,
                userAccountNumber: user.accountNumber,
                userAccountType: user.accountType,
                isActive: referralCommission.isActive,
                isApproved: referralCommission.isApproved,
                commission: referralCommission.commission
            }
        });
    } else {
        res.status(404);
        throw new Error('Referral commission not found.');
    }
});

const approvePendingCommission = asyncHandler(async (req, res) => {
    const commission = await Commission.findById(req.params.id);
    const user = await User.findById(commission.to);
    
    if (commission && user) {
        const { commissionType, isActive, isApproved, status } = req.body;
        const commissionAmount = parseFloat(req.body.commission);

        commission.isActive = isActive;
        commission.isApproved = isApproved;

        user.earning = (
            (status === 'Approved') ?
            (user.earning + commissionAmount) :
            user.earning
        ) || user.earning;

        user.referralCommission = (
            (status === 'Approved') ?
            (
                (commissionType === 'Referral') ?
                (user.referralCommission + commissionAmount) :
                user.referralCommission
            ) :
            user.referralCommission) || user.referralCommission;
        
        user.teamCommission = (
            (status === 'Approved') ?
            (
                (commissionType === 'Team') ?
                (user.teamCommission + commissionAmount) :
                user.teamCommission
            ) :
            user.teamCommission) || user.teamCommission;

        await commission.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Commission updated seccessfully.'
        });
    } else {
        res.status(404);
        throw new Error('Commission or User not found.');
    }
});

export {
    getUserReferralCommissions,
    getUserTeamCommissions,
    getAllReferralCommissions,
    getAllTeamCommissions,
    getCommissionById,
    approvePendingCommission
};