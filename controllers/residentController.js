import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Wastebin from '../models/wastebinModel.js';
import PickupRequest from '../models/pickupRequestModel.js';

// @desc    Get status of all linked Wastebins for the resident
// @route   GET /api/resident/wastebins
// @access  Private/Resident
const getResidentWastebins = asyncHandler(async (req, res) => {
    // req.user._id is the ObjectId of the logged-in Resident
    const wastebins = await Wastebin.find({ owner: req.user._id })
        .select('binTag wasteType fillLevel binStatus lastCollection');
    
    if (wastebins.length === 0) {
        return res.status(404).json({ message: 'No wastebins are currently linked to your account.' });
    }

    res.json(wastebins);
});

// @desc    Schedule a new special PickupRequest (Bulky/E-waste)
// @route   POST /api/resident/requests
// @access  Private/Resident
const schedulePickup = asyncHandler(async (req, res) => {
    const { requestType, description, scheduledDate } = req.body;
    
    if (!requestType || !description || !scheduledDate) {
        res.status(400);
        throw new Error('Please provide request type, description, and scheduled date.');
    }

    const requestId = `REQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const request = await PickupRequest.create({
        requestId,
        requestType,
        description,
        scheduledDate: new Date(scheduledDate),
        resident: req.user._id, // Link to the logged-in Resident
        status: 'PENDING',
    });

    res.status(201).json({
        message: 'Pickup request submitted successfully',
        request
    });
});

export { 
    getResidentWastebins, 
    schedulePickup 
};