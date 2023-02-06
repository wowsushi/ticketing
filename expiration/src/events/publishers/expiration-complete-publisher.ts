import { ExpirationCompleteEvent, Publisher, Subjects } from "@btticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}