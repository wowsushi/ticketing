import { Publisher, Subjects, OrderCancelledEvent } from "@btticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled
}