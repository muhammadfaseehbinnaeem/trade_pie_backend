import asyncHandler from '../middlewares/asyncHandler.js';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Investment from '../models/investmentModel.js';
import Commission from '../models/commissionModel.js';

const getAdminDashboard = asyncHandler(async (req, res) => {
    const approvedReferralCommissionsCount = await Commission.countDocuments({ commissionType: 'Referral', isActive: false, isApproved: true });
    const pendingReferralCommissionsCount = await Commission.countDocuments({ commissionType: 'Referral', isActive: true, isApproved: false });
    
    const approvedTeamCommissionsCount = await Commission.countDocuments({ commissionType: 'Team', isActive: false, isApproved: true });
    const pendingTeamCommissionsCount = await Commission.countDocuments({ commissionType: 'Team', isActive: true, isApproved: false });

    const approvedInvestmentsCount = await Investment.countDocuments({ isActive: false, isApproved: true });
    const rejectedInvestmentsCount = await Investment.countDocuments({ isActive: false, isApproved: false });
    const pendingInvestmentsCount = await Investment.countDocuments({ isActive: true, isApproved: false });

    res.status(200).json({
        success: true,
        data: {
            approvedReferralCommissionsCount,
            pendingReferralCommissionsCount,
            approvedTeamCommissionsCount,
            pendingTeamCommissionsCount,
            approvedInvestmentsCount,
            rejectedInvestmentsCount,
            pendingInvestmentsCount
        }
    });
});

const getPaymentAccount = asyncHandler(async (req, res) => {
    const admin = await Admin.findOne({ isAdmin: true });

    if (admin) {
        res.status(200).json({
            success: true,
            data: {
                accountNumber: admin.accountNumber,
                accountType: admin.accountType
            }
        });
    } else {
        res.status(404);
        throw new Error('Payment account not found.');
    }
});

const updatePaymentAccount = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
        admin.accountNumber = req.body.accountNumber || admin.accountNumber;
        admin.accountType = req.body.accountType || admin.accountType;

        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            data: {
                accountNumber: updatedAdmin.accountNumber,
                accountType: updatedAdmin.accountType
            }
        });
    } else {
        res.status(404);
        throw new Error('Admin not found.');
    }
});

const getGoals = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
        res.status(200).json({
            success: true,
            data: { goals: admin.goals }
        });
    } else {
        res.status(404);
        throw new Error('Goals not found.');
    }
});

const setGoals = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
        admin.goals = req.body.goals || admin.goals;

        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            data: { goals: updatedAdmin.goals }
        });
    } else {
        res.status(404);
        throw new Error('Admin not found.');
    }
})

export {
    getAdminDashboard,
    updatePaymentAccount,
    getPaymentAccount,
    getGoals,
    setGoals
};