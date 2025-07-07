import { CronJob } from 'cron';
import User from '../models/user.model';
import type { DeleteResult } from 'mongodb';

// Function to delete unverified users after 10 minutes
async function performCleanup(): Promise<void> {
    try {
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

        const result: DeleteResult = await User.deleteMany({
            isVerified: false,
            createdAt: { $lte: tenMinutesAgo }
        });

        console.log(`Cleaned up ${result.deletedCount} unverified users`);
    } catch (error) {
        console.error('Error in user cleanup job:', error);
    }
}

// Initialize the cron job
export function startUserCleanupJob(): CronJob {
    // Runs every 5 minutes (adjust as needed)
    const job = new CronJob(
        '*/5 * * * *',
        () => {
            // Wrap in void to explicitly discard the Promise
            void performCleanup();
        },
        null, // onComplete
        true, // start
        'UTC' // timeZone
    );

    console.log('User cleanup cron job started');
    return job;
}