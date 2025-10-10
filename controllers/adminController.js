import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { User } from '../models/userModel.js';
import { Route } from '../models/routeModels.js';
import Wastebin from '../models/wastebinModel.js';
import { AccountStatusEnum } from '../models/enums.js';

// @desc    Get all Users (Admin view)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ role: 1, name: 1 });
    res.json(users);
});

// @desc    Update a User's account status (e.g., ACTIVATE/SUSPEND)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res) => {
    const { accountStatus } = req.body; 

    if (!AccountStatusEnum.includes(accountStatus)) {
        res.status(400);
        throw new Error('Invalid account status provided.');
    }

    const user = await User.findById(req.params.id);

    if (user) {
        user.accountStatus = accountStatus;
        const updatedUser = await user.save();
        res.json({
            message: `User ${updatedUser.email} status updated to ${updatedUser.accountStatus}`,
            accountStatus: updatedUser.accountStatus,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


// @desc    Create a new collection Route
// @route   POST /api/admin/routes
// @access  Private/Admin
const createRoute = asyncHandler(async (req, res) => {
    const { routeName, scheduleDate, assignedCrewId, stops } = req.body;
    
    // 1. Validation check
    if (!routeName || !scheduleDate || !assignedCrewId || !stops || stops.length === 0) {
        res.status(400);
        throw new Error('Missing required route data (name, date, crew, or stops).');
    }
    
    const routeId = `RTE-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // 2. Format Routestops (ensuring wastebinId is a valid ObjectId)
    const routeStops = stops.map((stop, index) => ({
        intOrder: index + 1,
        addressLocation: stop.addressLocation,
        wastebin: stop.wastebinId, 
    }));

    // 3. Create the Route document
    const route = await Route.create({
        routeId,
        routeName,
        scheduleDate: new Date(scheduleDate),
        assignedCrew: assignedCrewId,
        routeStops,
        status: 'PLANNED',
    });

    res.status(201).json({ 
        message: 'Route created successfully', 
        routeId: route.routeId,
        route 
    });
});


// @desc    Get aggregated Waste Level Report
// @route   GET /api/admin/reports/waste-levels
// @access  Private/Admin
const getWasteLevelReport = asyncHandler(async (req, res) => {
    // Aggregation pipeline for core reporting
    const report = await Wastebin.aggregate([
        {
            $group: {
                _id: '$binStatus', // Group by binStatus (FULL, OVERFLOW, etc.)
                count: { $sum: 1 },
                totalFillLevel: { $sum: '$fillLevel' }
            }
        },
        {
            $project: {
                status: '$_id',
                count: 1,
                // Calculate average fill level for the group
                averageFillLevel: { $round: [{ $divide: ['$totalFillLevel', '$count'] }, 2] },
                _id: 0
            }
        },
        { $sort: { count: -1 } }
    ]);

    res.json(report);
});

export { 
    getUsers, 
    updateUserStatus, 
    createRoute, 
    getWasteLevelReport 
};