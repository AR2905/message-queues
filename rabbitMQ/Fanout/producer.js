import amqp from 'amqplib';

const exchangeName = 'Announcement_Exchange'
const exchangeType = 'fanout'
async function Announcement(Msg) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertExchange(exchangeName, exchangeType, { durable: true })

    channel.publish(exchangeName, ' ', Buffer.from(JSON.stringify(Msg)), { persistent: true })

    console.log('Announcement...', Msg)

    setTimeout(() => { connection.close() }, 1000);
}

Announcement({ Product: 'Iphone 19 Pro Max', Price: 199000 })