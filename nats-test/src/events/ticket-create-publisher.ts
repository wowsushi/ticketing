import { Publisher, Subjects, TicketCreatedEvent } from "@btticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}