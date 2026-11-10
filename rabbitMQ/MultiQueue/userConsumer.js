import amqp from 'amqplib';

async function ReadMail() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('user_queue', { durable: true, exclusive: false });

    channel.consume('user_queue', (msg) => {
        console.log('Reading Mail', JSON.parse(msg.content));
        channel.ack(msg)
    })

}

ReadMail()