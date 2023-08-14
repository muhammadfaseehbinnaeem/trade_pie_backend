import asyncHandler from '../middlewares/asyncHandler.js';
import Admin from '../models/adminModel.js';
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

const getMargins = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
        res.status(200).json({
            success: true,
            data: {
                referralCommission: admin.referralCommission,
                teamCommission: admin.teamCommission,
                profitRange1: admin.profitRange1,
                profitRange2: admin.profitRange2,
                profitRange3: admin.profitRange3,
                profitRange4: admin.profitRange4,
                profitRange5: admin.profitRange5
            }
        });
    } else {
        res.status(404);
        throw new Error('Margins not found.');
    }
});

const setMargins = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.user._id);

    if (admin) {
        admin.referralCommission = Number(req.body.referralCommission) || admin.referralCommission;
        admin.teamCommission = Number(req.body.teamCommission) || admin.teamCommission;
        admin.profitRange1 = Number(req.body.profitRange1) || admin.profitRange1;
        admin.profitRange2 = Number(req.body.profitRange2) || admin.profitRange2;
        admin.profitRange3 = Number(req.body.profitRange3) || admin.profitRange3;
        admin.profitRange4 = Number(req.body.profitRange4) || admin.profitRange4;
        admin.profitRange5 = Number(req.body.profitRange5) || admin.profitRange5;

        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            data: {
                referralCommission: updatedAdmin.referralCommission,
                teamCommission: updatedAdmin.teamCommission,
                profitRange1: updatedAdmin.profitRange1,
                profitRange2: updatedAdmin.profitRange2,
                profitRange3: updatedAdmin.profitRange3,
                profitRange4: updatedAdmin.profitRange4,
                profitRange5: updatedAdmin.profitRange5
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
});

export {
    getAdminDashboard,
    updatePaymentAccount,
    getPaymentAccount,
    getMargins,
    setMargins,
    getGoals,
    setGoals
};