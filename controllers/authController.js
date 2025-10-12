import asyncHandler from 'express-async-handler';
import { User, Administrator, Resident, CollectionCrewMember } from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import crypto from 'crypto'; 

// @desc    Register a new Resident 
// @route   POST /api/auth/register
// @access  Public
const registerResident = asyncHandler(async (req, res) => {
    // Validation is handled by validationMiddleware.js
    const { name, email, password, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Generate a unique userId (PK)
    const userId = `RES-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create Resident document
    const resident = await Resident.create({
        userId,
        name,
        email,
        password, // Hashed via pre-save hook in userModel.js
        address,
        role: 'Resident' // Discriminator key
    });

    if (resident) {
        res.status(201).json({
            _id: resident._id,
            name: resident.name,
            email: resident.email,
            role: resident.role,
            token: generateToken(resident._id), 
        });
    } else {
        res.status(400);
        throw new Error('Invalid resident data');
    }
});

// @desc    Register a new Administrator
// @route   POST /api/auth/register-admin
// @access  Public (should be restricted in production)
const registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, department } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const userId = `ADM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const admin = await Administrator.create({
        userId,
        name,
        email,
        password,
        department,
        role: 'Administrator'
    });
    if (admin) {
        res.status(201).json({
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid admin data');
    }
});

// @desc    Register a new Collection Crew Member
// @route   POST /api/auth/register-crew
// @access  Public (should be restricted in production)
const registerCrewMember = asyncHandler(async (req, res) => {
    const { name, email, password, employeeId, contactNumber, vehicle } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const userId = `CREW-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const crew = await CollectionCrewMember.create({
        userId,
        name,
        email,
        password,
        employeeId,
        contactNumber,
        vehicle,
        role: 'CollectionCrewMember'
    });
    if (crew) {
        res.status(201).json({
            _id: crew._id,
            name: crew.name,
            email: crew.email,
            role: crew.role,
            token: generateToken(crew._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid crew member data');
    }
});

// @desc    Authenticate User (Login)
// @route   POST /api/auth/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    // Validation is handled by validationMiddleware.js
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check password and account status
    if (user && (await user.matchPassword(password))) {
        if (user.accountStatus !== 'ACTIVE') {
            res.status(403);
            throw new Error(`Account is ${user.accountStatus}. Access denied.`);
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role, 
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Get User profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the 'protect' middleware
    res.json(req.user);
});


export { registerResident, registerAdmin, registerCrewMember, authUser, getUserProfile };