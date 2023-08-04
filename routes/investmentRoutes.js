import express from 'express';

import {
    createInvestment,
    getUserInvestments,
    getInvestmentById,
    updatePendingInvestment,
    getAllInvestments,
} from '../controllers/investmentController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createInvestment);

router.route('/profile/:status').get(protect, getUserInvestments);

router.route('/allinvestments/:status').get(protect, admin, getAllInvestments);

router.route('/:id').get(protect, getInvestmentById);
router.route('/:id').put(protect, admin, updatePendingInvestment);

export default router;