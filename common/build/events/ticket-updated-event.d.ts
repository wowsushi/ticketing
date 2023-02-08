import { Subjects } from "./subjects";
export interface TicketUpdatedEvent {
    subject: Subjects.TicketUpdated;
    data: {
        version: number;
        id: string;
        title: string;
        price: number;
        userId: string;
        orderId?: string;
    };
}
