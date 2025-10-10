/**
 * Basic validation for the fields required to register a Resident.
 */
const validateRegistration = (req, res, next) => {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
        res.status(400);
        throw new Error('Please enter all required fields: name, email, password, and address.');
    }

    // Basic email format check (optional but recommended)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        res.status(400);
        throw new Error('Please enter a valid email format.');
    }

    // Basic password strength check
    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters long.');
    }

    next();
};

/**
 * Basic validation for login.
 */
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please enter both email and password.');
    }
    next();
};

export { validateRegistration, validateLogin };