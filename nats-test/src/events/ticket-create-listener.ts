import { Message } from "node-nats-streaming";
import { Listener } from "../../../common/src/events/base-listener";
import { Subjects, TicketCreatedEvent } from "@btticket/common";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated

    queueGroupName = "payments-service";
  
    onMessage = (data: TicketCreatedEvent['data'], msg: Message) => {  
      msg.ack();
    };
  }
  