const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON bodies

// Import Routes
const tripRoutes = require('./routes/tripRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Mount Routes
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);

// Base route for testing
app.get('/', (req, res) => {
    res.send('BatwaraNow Backend is Running...');
});

const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});
