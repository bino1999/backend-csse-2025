// Function to handle route not found (404)
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Pass the error to the general error handler
};

// General error handler middleware
const errorHandler = (err, req, res, next) => {
    // Determine the status code: keep existing status if set, otherwise 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    // Send a structured JSON response
    res.json({
        message: err.message,
        // Only show stack trace in development mode for security
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };