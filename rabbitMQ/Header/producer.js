import amqp from 'amqplib';
async function SendMsg(Msg, Headers) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'header_exchange';
    const exchangeType = 'headers';

    await channel.assertExchange(exchangeName, exchangeType, { durable: true })

    channel.publish(exchangeName, '', Buffer.from(JSON.stringify(Msg)), { persistent: true, headers: Headers });

    console.log(`Msg ${JSON.stringify(Msg)} Sent with headers ${JSON.stringify(Headers)}`)

    setTimeout(() => { connection.close() }, 1000);
}

SendMsg({ to: 'user@mail.com', subject: 'Welcome' }, { 'notification-type': 'email' })

SendMsg({ phone: '+919999999999', text: 'Your OTP is 1234' }, { 'notification-type': 'sms' })
