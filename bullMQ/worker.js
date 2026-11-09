import { Worker } from "bullmq";

const SendEmail = (JobId) => new Promise((resolve, reject) => {
    console.log('TYEP:', typeof JobId)
    setTimeout(() => {
        // Even Ids Will Pass
        Number(JobId) % 2 === 0 ? resolve() : reject();
    }, 5000);
});

const worker = new Worker('email-queue', async (job) => {
    console.log(`Msg Received : ${job.id} \n 
        Processing Msg... \n
        Sending email to ${job.data.email}`);

    try {
        await SendEmail(job.id);
        console.log('Email Sent', job.id);
    } catch (error) {
        console.error(`Something Went Wrong for job ${job.id}:`, error.message);
        throw error;
    }
}, {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

// Optional: Listen to worker lifecycle events for logging
worker.on('completed', (job) => {
    console.log(`Job ${job.id} has completed successfully!`);
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with error: ${err.message}`);
});