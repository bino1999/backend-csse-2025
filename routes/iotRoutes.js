import express from 'express';
import { updateFillLevel } from '../controllers/iotController.js';

const router = express.Router();

// NOTE: This route is secured internally within the controller using a static API Key check.
// For production, a dedicated API Key middleware is recommended.

// @route PUT /api/iot/wastebin/:tagId/fill
// @desc  Endpoint for sensors to send real-time fill level data
router.route('/wastebin/:tagId/fill').put(updateFillLevel); 

export default router;