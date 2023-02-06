import { PaymentCreatedEvent, Publisher, Subjects } from "@btticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated
}