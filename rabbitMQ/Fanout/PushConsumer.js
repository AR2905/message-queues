import amqp from 'amqplib';
const exchangeName = 'Announcement_Exchange'
const exchangeType = 'fanout'
async function GetSMS() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, exchangeType, { durable: true })

    const Q = await channel.assertQueue('', { durable: true, exclusive: true })

    await channel.bindQueue(Q.queue, exchangeName, '')

    console.log('Waiting for message...')

    channel.consume(Q.queue, (Msg) => {
        console.log('[Push Notification] : ', JSON.parse(Msg.content))
        channel.ack(Msg)
    })
}
GetSMS()