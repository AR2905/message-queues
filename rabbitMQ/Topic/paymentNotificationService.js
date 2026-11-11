import amqp from 'amqplib';
async function ReadMsg() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'notification_exchange';
    const exchangeType = 'topic';
    const queueName = 'payment_queue'
    await channel.assertExchange(exchangeName, exchangeType, { durable: true })
    await channel.assertQueue(queueName, { durable: true, exclusive: true })

    await channel.bindQueue(queueName, exchangeName, 'payment.*')

    console.log('Waiting for Notification....')

    channel.consume(queueName, (msg) => {
        console.log('[Payment Notification] You have new msg', JSON.parse(msg.content))
        channel.ack(msg)
    })

}
ReadMsg();