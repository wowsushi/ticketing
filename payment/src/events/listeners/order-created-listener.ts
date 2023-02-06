import { Listener, OrderCreatedEvent, Subjects } from "@btticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
    queueGroupName = queueGroupName

    onMessage = async (data: OrderCreatedEvent['data'], msg: Message) => {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        })

        await order.save()

        msg.ack()
    }
}