import { Queue } from "bullmq";

const notificationQueue = new Queue('email-queue', {
    connection: {
        host: "127.0.0.1",
        port: 6379,
    }
});

async function init() {
    try {
        const res = await notificationQueue.add('Register Email Job', {
            email: 'ash.rd2905@gmail.com',
            subject: 'Learning Microservice',
            msg: 'Microservice + BullMQ'
        });
        const counts = await notificationQueue.getJobCounts();
        console.log('Total Jobs: ', counts);
        console.log('Job added to queue successfully. Job ID:', res.id);
    } catch (error) {
        console.error('Failed to add job to queue:', error);
    } finally {
        // Only close the queue; you don't need to manually quit a separate redis connection object
        await notificationQueue.close();
    }
}

init();