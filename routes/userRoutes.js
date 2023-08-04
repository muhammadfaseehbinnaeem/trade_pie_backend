import express from 'express';

import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    verifyEmailForgotPassword,
    changeUserPassword,
    setForgotPassword
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);

router.route('/password').put(protect, changeUserPassword);

router.route('/verifyemail').post(verifyEmailForgotPassword);
router.route('/forgotpassword').put(setForgotPassword);

export default router;