import { Publisher, Subjects, TicketUpdatedEvent } from "@btticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    displayName = 'abc'
    readonly subject = Subjects.TicketUpdated
}