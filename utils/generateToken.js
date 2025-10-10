import jwt from 'jsonwebtoken';

/**
 * Generates a JSON Web Token (JWT) for the given user ID.
 * The token contains the user's ID as the payload and is signed 
 * using the secret key stored in the .env file.
 * * @param {string} id - The MongoDB ObjectId of the authenticated user.
 * @returns {string} The signed JWT token.
 */
const generateToken = (id) => {
    // The payload is the object we want to encode in the token.
    // The user ID is sufficient for identifying the user later.
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // The token will be valid for 30 days
    });
};

export default generateToken;