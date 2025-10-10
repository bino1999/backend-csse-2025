import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User } from '../models/userModel.js'; 
// We import the base User model to find the user by ID

/**
 * Middleware to protect routes by validating the JWT from the Authorization header.
 * Attaches the authenticated user object (excluding password) to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the header (e.g., "Authorization: Bearer <token>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer" and the actual token)
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify token and decode the payload (which contains the user ID)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find user by ID and attach to request object (excluding password)
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user data not found.');
            }

            // 4. Continue to the next middleware/controller
            next();

        } catch (error) {
            console.error('JWT Error:', error.message);
            res.status(401);
            // If verification fails (e.g., token expired or tampered with)
            throw new Error('Not authorized, invalid or expired token.');
        }
    }

    // If no token is provided in the header
    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token provided.');
    }
});

/**
 * Middleware to check if the authenticated user belongs to the required role(s).
 * @param {...string} roles - List of allowed roles (e.g., 'Administrator', 'Resident').
 */
const checkRole = (...roles) => {
    return (req, res, next) => {
        // req.user is populated by the 'protect' middleware
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            // 403 Forbidden: User is authenticated but does not have the necessary permissions
            throw new Error(`Access Forbidden. Required role: ${roles.join(' or ')}.`);
        }
        next();
    };
};

export { protect, checkRole };