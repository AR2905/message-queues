import amqp from 'amqplib';

async function SendMail() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const exchangeName = 'mail_exchange'

    const subsQueueName = 'subs_queue'
    const userQueueName = 'user_queue'

    const subsRoutingKey = 'send_mail_to_subscriber'
    const userRoutingKey = 'send_mail_to_user'

    await channel.assertExchange(exchangeName, 'direct', { durable: true });

    await channel.assertQueue(subsQueueName, { durable: true, exclusive: false })
    await channel.assertQueue(userQueueName, { durable: true, exclusive: false })

    await channel.bindQueue(subsQueueName, exchangeName, subsRoutingKey);
    await channel.bindQueue(userQueueName, exchangeName, userRoutingKey);

    const message = {
        to: 'ash.rd2905@gmail.com',
        from: 'thear2905@gmail.com',
        subject: 'Job Application 12 - FullStack Developer',
        body: 'If you will not hire me, then its your loss'
    };

    const isSent = channel.publish(
        exchangeName,
        subsRoutingKey,
        Buffer.from(JSON.stringify(message))
    );

    if (isSent) {
        console.log(`Sent to Subs`, message);
    } else {
        console.log('Message was buffered locally (write stream choked)');
    }

    // 4. Gracefully close channel and connection sequentially
    await channel.close();
    await connection.close();



}

SendMail()