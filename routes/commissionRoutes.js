import express from 'express';

import {
    getUserReferralCommissions,
    getUserTeamCommissions,
    getAllReferralCommissions,
    getAllTeamCommissions,
    getCommissionById,
    approvePendingCommission
} from '../controllers/commissionController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/referral/:status').get(protect, getUserReferralCommissions);
router.route('/team/:status').get(protect, getUserTeamCommissions);

router.route('/allreferral/:status').get(protect, admin, getAllReferralCommissions);
router.route('/allteam/:status').get(protect, admin, getAllTeamCommissions);

router.route('/:id').get(protect, getCommissionById);
router.route('/:id').put(protect, admin, approvePendingCommission);

export default router;