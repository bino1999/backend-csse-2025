import express from 'express';
import { 
    registerResident, 
    authUser, 
    getUserProfile 
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route POST /api/auth/register
// @desc  Register a new Resident account (Public)
router.post('/register', registerResident);

// @route POST /api/auth/login
// @desc  Authenticate User (Admin, Resident, Crew) and issue JWT (Public)
router.post('/login', authUser);

// @route GET /api/auth/profile
// @desc  Get the authenticated user's profile details (Private)
router.route('/profile').get(protect, getUserProfile); 

export default router;