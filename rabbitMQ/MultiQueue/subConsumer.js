import amqp from 'amqplib';

async function ReadMail() {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    await channel.assertQueue('subs_queue', { durable: true, exclusive: false });

    channel.consume('subs_queue', (msg) => {
        console.log('Reading Mail', JSON.parse(msg.content));
        channel.ack(msg)
    })

}

ReadMail()