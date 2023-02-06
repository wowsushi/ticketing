import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@btticket/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
    queueGroupName = queueGroupName
    onMessage = async (data: PaymentCreatedEvent['data'], msg: Message) => {
        const order = await Order.findById(data.orderId)

        if (!order) {
            throw Error('order not found')
        }

        order.set({
            status: OrderStatus.Complete
        })

        await order.save()

        msg.ack()
    }
}