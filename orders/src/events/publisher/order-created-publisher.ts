import { Publisher, Subjects, OrderCreatedEvent } from "@btticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject = Subjects.OrderCreated
}