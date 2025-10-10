// routes/userRoutes.js
import express from 'express';
const router = express.Router();
import authenticate from '../middleware/authMiddleware.js';
import authorize from '../middleware/authorize.js';
import userController from '../controllers/adminController.js';

// All authenticated users (admin, user, employee) can get their own profile
router.get('/profile', authenticate, userController.getProfile);

// Only 'admin' can access this
router.get('/all-users', authenticate, authorize(['admin']), userController.getAllUsers);

// 'admin' and 'employee' can access this specific resource
router.put('/employee-data/:id', authenticate, authorize(['admin', 'employee']), userController.updateEmployeeData);

export default router;