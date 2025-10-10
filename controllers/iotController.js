import asyncHandler from 'express-async-handler';
import Wastebin from '../models/wastebinModel.js';

// IMPORTANT: MUST be defined in .env
const IoT_API_KEY = process.env.IOT_API_KEY; 

/**
 * Determines the bin status based on fill level percentage
 * @param {number} level - Fill level percentage (0-100).
 */
const getStatusByLevel = (level) => {
    if (level >= 95) return 'OVERFLOW';
    if (level >= 80) return 'FULL';
    if (level >= 30) return 'PARTIAL';
    return 'EMPTY';
};

// @desc    Update Wastebin Fill Level and Status (from Sensor)
// @route   PUT /api/iot/wastebin/:tagId/fill
// @access  Internal/Secure (API Key required)
const updateFillLevel = asyncHandler(async (req, res) => {
    const { tagId } = req.params;
    const { fillLevel, apiKey } = req.body; 

    // 1. Security Check (Verifying API Key from sensor request body)
    if (!apiKey || apiKey !== IoT_API_KEY) {
        res.status(401);
        throw new Error('Unauthorized IoT device access. Invalid API Key.');
    }
    
    // 2. Validate incoming data
    if (typeof fillLevel !== 'number' || fillLevel < 0 || fillLevel > 100) {
        res.status(400);
        throw new Error('Invalid fillLevel data (must be a number between 0 and 100).');
    }

    // 3. Find the Wastebin
    const wastebin = await Wastebin.findOne({ binTag: tagId });

    if (!wastebin) {
        res.status(404);
        throw new Error(`Wastebin with tag ${tagId} not found.`);
    }

    // 4. Update status and level
    wastebin.fillLevel = fillLevel;
    wastebin.binStatus = getStatusByLevel(fillLevel); 

    await wastebin.save();

    res.status(200).json({
        message: 'Wastebin data updated successfully',
        binId: wastebin.binId,
        fillLevel: wastebin.fillLevel,
        binStatus: wastebin.binStatus,
    });
});


export { updateFillLevel };