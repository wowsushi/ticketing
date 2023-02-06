import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@btticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete
    queueGroupName = queueGroupName

    onMessage = async (data: ExpirationCompleteEvent['data'], msg: Message) => {
        const order = await Order.findById(data.orderId).populate('ticket')

        if (!order) {
            throw new Error('Order not found')
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack()
        }

        order.set({
            status: OrderStatus.Cancelled,
        })

        await order.save()

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack()
    }
}