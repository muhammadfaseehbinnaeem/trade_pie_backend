import express from 'express';

import {
    getAdminDashboard,
    updatePaymentAccount,
    getPaymentAccount,
    getGoals,
    setGoals
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/dashboard').get(protect, admin, getAdminDashboard);

router.route('/paymentaccount').get(protect, getPaymentAccount);
router.route('/paymentaccount').put(protect, admin, updatePaymentAccount);

router.route('/goals').get(protect, getGoals);
router.route('/goals').put(protect, admin, setGoals);

export default router;