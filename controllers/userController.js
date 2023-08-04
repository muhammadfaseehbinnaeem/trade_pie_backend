import asyncHandler from '../middlewares/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import Commission from '../models/commissionModel.js';

const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        accountNumber,
        accountType,
        referral
    } = req.body;

    if (referral === '') {
        const userExists = await User.findOne({ email });
    
        if (userExists) {
            res.status(400);
            throw new Error('User exists already.');
        }

        const user = await User.create({
            name,
            email,
            password,
            accountNumber,
            accountType
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully.'
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data.');
        }
    } else {
        const referralUser = await User.findById(referral);
        
        if (referralUser) {
            const userExists = await User.findOne({ email });
        
            if (userExists) {
                res.status(400);
                throw new Error('User exists already.');
            }
    
            const admin = await Admin.findOne({ isAdmin: true });
        
            const user = await User.create({
                name,
                email,
                password,
                accountNumber,
                accountType,
                referral: referralUser._id
            });
        
            if (admin && user) {
                const referralCommission = await Commission.create({
                    from: user._id,
                    to: referral,
                    commission: admin.referralCommission,
                    commissionType: 'Referral'
                });
    
                if (referralCommission) {
                    if (referralUser.referral) {
                        const teamCommission = await Commission.create({
                            from: user._id,
                            to: referralUser.referral,
                            commission: admin.teamCommission,
                            commissionType: 'Team'
                        });
                        
                        if (teamCommission) {
                            res.status(201).json({
                                success: true,
                                message: 'User registered successfully.'
                            });
                        } else {
                            res.status(400);
                            throw new Error('Team commission not given.');
                        }
                    } else {
                        res.status(201).json({
                            success: true,
                            message: 'User registered successfully.'
                        });
                    }
                } else {
                    res.status(400);
                    throw new Error('Referral commission not given.');
                }
            } else {
                res.status(400);
                throw new Error('Invalid user data.');
            }
        } else {
            res.status(400);
            throw new Error('Invalid referral code.');
        }
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        const token = generateToken(res, admin._id);

        res.status(200).json({
            success: true,
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                isAdmin: admin.isAdmin,
                accountNumber: admin.accountNumber,
                accountType: admin.accountType,
                referralCommission: admin.referralCommission,
                teamCommission: admin.teamCommission,
                goals: admin.goals
            },
            token
        });
    } else {
        const user = await User.findOne({ email });
    
        if (user && (await user.matchPassword(password))) {
            const token = generateToken(res, user._id);
    
            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    accountNumber: user.accountNumber,
                    accountType: user.accountType,
                    referral: user.referral,
                    referralCommission: user.referralCommission,
                    teamCommission: user.teamCommission,
                    investment: user.investment,
                    earning: user.earning,
                    profit: user.profit
                },
                token
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password.');
        }
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully.'
    });
});

const getUserProfile = asyncHandler(async ( req, res) => {
    const user = await User.findById(req.user._id);
    const admin = await Admin.findOne({ isAdmin: true });

    if (user && admin) {
        res.status(200).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                accountNumber: user.accountNumber,
                accountType: user.accountType,
                referral: user.referral,
                referralCommission: user.referralCommission,
                teamCommission: user.teamCommission,
                investment: user.investment,
                earning: user.earning,
                profit: user.profit,
                goals: admin.goals
            }
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.accountNumber = req.body.accountNumber || user.accountNumber;
        user.accountType = req.body.accountType || user.accountType;
        
        if (req.body.password) {
            user.password = req.body.password || user.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                isAdmin: updatedUser.isAdmin,
                accountNumber: updatedUser.accountNumber,
                accountType: updatedUser.accountType,
                referral: updatedUser.referral,
                referralCommission: updatedUser.referralCommission,
                teamCommission: updatedUser.teamCommission,
                investment: updatedUser.investment,
                earning: updatedUser.earning,
                profit: updatedUser.profit
            }
        });
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

const verifyEmailForgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        res.status(200).json({
            success: true,
            data: { email: user.email }
        });
    } else {
        const admin = await Admin.findOne({ email: req.body.email });

        if (admin) {
            res.status(200).json({
                success: true,
                data: { email: admin.email }
            });
        } else {
            res.status(404);
            throw new Error('User not found.');
        }
    }
});

const changeUserPassword = asyncHandler(async (req, res) => {
    const user = req.user.isAdmin ?
    await Admin.findById(req.user._id) :
    await User.findById(req.user._id);

    if (user) {
        if (await user.matchPassword(req.body.oldPassword)) {
            user.password = req.body.newPassword || user.password;
    
            await user.save();
    
            res.status(200).json({
                success: true,
                message: 'Password changed successfully.'
            });
        } else {
            res.status(401);
            throw new Error('Old password is incorrect.');
        }
    } else {
        res.status(404);
        throw new Error('User not found.');
    }
});

const setForgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
        user.password = req.body.password || user.password;
    
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } else {
        const admin = await Admin.findOne({ email: req.body.email });

        if (admin) {
            admin.password = req.body.password || admin.password;

            await admin.save();

            res.status(200).json({
                success: true,
                message: 'Password changed successfully.'
            });
        } else {
            res.status(404);
            throw new Error('User not found.');
        }
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    verifyEmailForgotPassword,
    changeUserPassword,
    setForgotPassword
};