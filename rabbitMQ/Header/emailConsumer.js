import amqp from 'amqplib';
async function ReadMsg() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'header_exchange';
    const exchangeType = 'headers';
    const queueName = 'email_queue'
    await channel.assertExchange(exchangeName, exchangeType, { durable: true })
    await channel.assertQueue(queueName, { durable: true, exclusive: true })

    await channel.bindQueue(queueName, exchangeName, '', { 'x-match': 'all', 'notification-type': 'email' })

    console.log('Waiting for Notification....')
    channel.consume(queueName, (msg) => {
        console.log('[Email Notification] You have new msg', JSON.parse(msg.content))
        channel.ack(msg)
    })

}
ReadMsg();
