import express from 'express';

import {
    createWithdrawal,
    getUserWithdrawals,
    getWithdrawalById,
    updatePendingWithdrawal,
    getAllWithdrawals
} from '../controllers/withdrawalController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createWithdrawal);

router.route('/profile/:status').get(protect, getUserWithdrawals);

router.route('/allwithdrawals/:status').get(protect, admin, getAllWithdrawals);

router.route('/:id').get(protect, getWithdrawalById);
router.route('/:id').put(protect, admin, updatePendingWithdrawal);

export default router;