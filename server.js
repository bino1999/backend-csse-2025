import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// import authRoutes from './routes/authRoutes.js';
// import adminRoutes from './routes/adminRoutes.js';
// import residentRoutes from './routes/residentRoutes.js';
// import crewRoutes from './routes/crewRoutes.js';
// import iotRoutes from './routes/iotRoutes.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing of JSON data in the request body

// --- Route Definitions ---
// 1. Auth & Profile Routes
// app.use('/api/auth', authRoutes);

// // 2. Admin Routes
// app.use('/api/admin', adminRoutes);

// // 3. Resident Routes
// app.use('/api/resident', residentRoutes);

// // 4. Crew Routes
// app.use('/api/crew', crewRoutes);

// // 5. IoT/Sensor Data Routes (Must be highly secured)
// app.use('/api/iot', iotRoutes);


// --- Error Handling Middleware (To be created later) ---
// app.use(notFound);
// app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));