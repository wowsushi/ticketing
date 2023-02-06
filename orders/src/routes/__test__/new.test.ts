import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    title: "consert",
    price: 20,
    ticketId: new mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "fdsfef",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticket: ticket.id })
    .expect(400);
});
it("reserve a ticket", async () => {
  const ticket = Ticket.build({
    title: "consert",
    price: 20,
    ticketId: new mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: "consert",
    price: 20,
    ticketId: new mongoose.Types.ObjectId().toHexString()
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})