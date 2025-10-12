import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    getUsers, 
    updateUserStatus, 
    createRoute, 
    getWasteLevelReport,
    getAllPickupRequests,
    updatePickupRequest
} from '../controllers/adminController.js';

const router = express.Router();

// Middleware to ensure the user is logged in AND has the 'Administrator' role
const adminProtect = [protect, checkRole('Administrator')];

// --- Users Management ---
// @route GET /api/admin/users
// @desc  Get list of all users
router.route('/users')
    .get(adminProtect, getUsers); 

// @route PUT /api/admin/users/:id/status
// @desc  Update a user's account status
router.route('/users/:id/status')
    .put(adminProtect, updateUserStatus); 

// --- Route Management ---
// @route POST /api/admin/routes
// @desc  Create a new collection route
router.route('/routes')
    .post(adminProtect, createRoute); 

// --- Reporting ---
// @route GET /api/admin/reports/waste-levels
// @desc  Get aggregated data on bin fill levels
router.route('/reports/waste-levels')
    .get(adminProtect, getWasteLevelReport); 

// --- Special Pickup Requests Management ---
// @route GET /api/admin/pickup-requests
// @desc  Get list of all special pickup requests
router.route('/pickup-requests')
    .get(adminProtect, getAllPickupRequests);

// @route PUT /api/admin/pickup-requests/:id
// @desc  Update a special pickup request
router.route('/pickup-requests/:id')
    .put(adminProtect, updatePickupRequest);

export default router;