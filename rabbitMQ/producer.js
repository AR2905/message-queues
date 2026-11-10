import amqp from 'amqplib';

async function SendMail() {
    try {
        // 1. Establish connection and channel
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchangeName = 'mail_exchange';
        const queueName = 'mail_queue';
        const routingKey = 'send_mail';

        const message = {
            to: 'ash.rd2905@gmail.com',
            from: 'thear2905@gmail.com',
            subject: 'Job Application 12 - FullStack Developer',
            body: 'If you will not hire me, then its your loss'
        };

        // 2. Assert topologies (Exchange, Queue, and Bindings)
        await channel.assertExchange(exchangeName, 'direct', { durable: true });
        await channel.assertQueue(queueName, { durable: true, exclusive: false });
        await channel.bindQueue(queueName, exchangeName, routingKey);

        // 3. Publish the message
        const isSent = channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify(message))
        );

        if (isSent) {
            console.log('Mail Sent to Exchange:', message);
        } else {
            console.log('Message was buffered locally (write stream choked)');
        }

        // 4. Gracefully close channel and connection sequentially
        await channel.close();
        await connection.close();

    } catch (error) {
        console.error('Error in RabbitMQ Producer:', error);
    }
}

SendMail();
