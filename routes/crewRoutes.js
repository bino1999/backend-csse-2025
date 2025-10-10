import express from 'express';
import { protect, checkRole } from '../middleware/authMiddleware.js';
import { 
    getCurrentRoute, 
    recordCollection 
} from '../controllers/crewController.js';

const router = express.Router();

// Middleware to ensure the user is logged in AND has the 'CollectionCrewMember' role
const crewProtect = [protect, checkRole('CollectionCrewMember')];

// --- Route Operations ---
// @route GET /api/crew/route/current
// @desc  Get the current Route and stops assigned to the crew member
router.route('/route/current')
    .get(crewProtect, getCurrentRoute); 

// --- Collection Recording ---
// @route PUT /api/crew/collection/:binTag
// @desc  Record a collection event by scanning the bin tag (Sets fillLevel=0)
router.route('/collection/:binTag')
    .put(crewProtect, recordCollection); 

export default router;