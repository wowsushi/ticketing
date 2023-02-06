import { Message } from 'node-nats-streaming'
import { Subjects, Listener, TicketCreatedEvent } from '@btticket/common'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
    queueGroupName = queueGroupName

    onMessage = async (data: TicketCreatedEvent['data'], msg: Message) => {
        const { id, title, price } = data
        const ticket = Ticket.build({
            title, price, ticketId: id,
        })
        await ticket.save()

        msg.ack()
    }
}