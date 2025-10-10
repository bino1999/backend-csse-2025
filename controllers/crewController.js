import asyncHandler from 'express-async-handler';
import { Route } from '../models/routeModels.js';
import Wastebin from '../models/wastebinModel.js';

// @desc    Get the current Route assigned to the Collection Crew Member
// @route   GET /api/crew/route/current
// @access  Private/Crew
const getCurrentRoute = asyncHandler(async (req, res) => {
    // Find route scheduled for today assigned to the logged-in crew member (req.user._id)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of next day

    const route = await Route.findOne({
        assignedCrew: req.user._id,
        scheduleDate: { $gte: today, $lt: tomorrow } // Find route scheduled for today
    }).populate({
        path: 'routeStops.wastebin', // Populate the actual Wastebin data for the stops
        select: 'binTag wasteType owner fillLevel binStatus' 
    });

    if (!route) {
        return res.status(404).json({ message: 'No route assigned for today.' });
    }

    res.json(route);
});


// @desc    Record a Wastebin collection event
// @route   PUT /api/crew/collection/:binTag
// @access  Private/Crew
const recordCollection = asyncHandler(async (req, res) => {
    const { binTag } = req.params;

    // 1. Find the Wastebin using the scanned tag
    const wastebin = await Wastebin.findOne({ binTag });

    if (!wastebin) {
        res.status(404);
        throw new Error(`Wastebin with tag ${binTag} not found.`);
    }

    // 2. Update collection status: set level to 0 and status to EMPTY
    wastebin.fillLevel = 0;
    wastebin.binStatus = 'EMPTY';
    wastebin.lastCollection = new Date(); // Record the exact time of collection
    
    await wastebin.save();

    res.json({
        message: `Collection successfully recorded for bin ${binTag}.`,
        binId: wastebin.binId,
        lastCollection: wastebin.lastCollection
    });
});

export { 
    getCurrentRoute, 
    recordCollection 
};