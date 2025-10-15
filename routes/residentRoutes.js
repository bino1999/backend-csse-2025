import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    getResidentWastebins, 
    schedulePickup,
    getRequestedPickups 
} from '../controllers/residentController.js';

const router = express.Router();

// Middleware to ensure the user is logged in AND has the 'Resident' role
const residentProtect = [protect, checkRole('Resident')];

// --- Wastebin Monitoring ---
// @route GET /api/resident/wastebins
// @desc  Get status and details of bins owned by the logged-in resident
router.route('/wastebins')
    .get(residentProtect, getResidentWastebins); 

// --- Pickup Requests (Bulky/E-Waste) ---
// @route POST /api/resident/requests
// @desc  Schedule a new special waste collection request
router.route('/requests')
    .post(residentProtect, schedulePickup); 

router.route('/fetchPickups')
    .get(residentProtect, getRequestedPickups);     

    

export default router;