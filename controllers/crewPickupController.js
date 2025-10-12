import asyncHandler from 'express-async-handler';
import PickupRequest from '../models/pickupRequestModel.js';

// @desc    Get all pickup requests assigned to the logged-in crew member
// @route   GET /api/crew/pickup-requests
// @access  Private/Crew
const getAssignedPickups = asyncHandler(async (req, res) => {
    const pickups = await PickupRequest.find({
        assignedCrew: req.user._id,
        status: { $nin: ['COLLECTED', 'REJECTED'] }
    }).populate('resident', 'name email address').sort({ scheduledDate: 1 });
    res.json(pickups);
});

// @desc    Start a pickup (set status to IN_PROGRESS)
// @route   PUT /api/crew/pickup-requests/:id/start
// @access  Private/Crew
const startPickup = asyncHandler(async (req, res) => {
    const request = await PickupRequest.findById(req.params.id);
    if (!request) throw new Error('Pickup request not found');
    if (!request.assignedCrew || request.assignedCrew.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized for this pickup');
    }
    request.status = 'IN_PROGRESS';
    await request.save();
    res.json({ message: 'Pickup started', request });
});

// @desc    Complete a pickup (set status to COLLECTED)
// @route   PUT /api/crew/pickup-requests/:id/complete
// @access  Private/Crew
const completePickup = asyncHandler(async (req, res) => {
    const request = await PickupRequest.findById(req.params.id);
    if (!request) throw new Error('Pickup request not found');
    if (!request.assignedCrew || request.assignedCrew.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized for this pickup');
    }
    request.status = 'COMPLETED';
    await request.save();
    res.json({ message: 'Pickup completed', request });
});

export { getAssignedPickups, startPickup, completePickup };
