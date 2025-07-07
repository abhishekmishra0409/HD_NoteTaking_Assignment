import connectDB from './config/db';
import app from './app'
import { config } from 'dotenv';
import { startUserCleanupJob } from './cron/userCleanup';

config();

const PORT = process.env.PORT || 5000;

// Start the user cleanup cron job
startUserCleanupJob();

// Connect to database
connectDB();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
