import { Publisher, Subjects, TicketCreatedEvent } from "@btticket/common";
import { natsWrapper } from "../../nats-wrapper";
import { TicketUpdatedPublisher } from "./ticket-updated-publisher";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    displayName = 'abc'
    readonly subject = Subjects.TicketCreated
}