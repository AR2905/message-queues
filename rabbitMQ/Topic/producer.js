import amqp from 'amqplib';
async function SendMsg(RoutingKey, Msg) {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchangeName = 'notification_exchange';
    const exchangeType = 'topic';

    await channel.assertExchange(exchangeName, exchangeType, { durable: true })

    channel.publish(exchangeName, RoutingKey, Buffer.from(JSON.stringify(Msg)), { persistent: true });

    console.log(`Msg ${JSON.stringify(Msg)} Sent on ${RoutingKey}`)

    setTimeout(() => { connection.close() }, 1000);
}

SendMsg('order.placed', { orderId: 123, status: 'Placed' })

SendMsg('payment.processed', { paymentId: 456, status: 'processed' })