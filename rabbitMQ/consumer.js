import amqp from 'amqplib';

async function RecievedMail() {
    try {
        // 1. Establish connection and channel
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const queueName = 'mail_queue';

        // Change this line in your consumer code to match the producer
        await channel.assertQueue(queueName, { durable: true, exclusive: false });


        channel.consume(queueName, (message) => {
            console.log('Received Message : ', JSON.parse(message.content))
            channel.ack(message)
        })

    } catch (error) {
        console.error('Error in RabbitMQ Producer:', error);
    }
}

RecievedMail();
