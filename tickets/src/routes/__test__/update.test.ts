import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "abc",
      price: 10,
    })
    .expect(404);
});

it("returns 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "abc",
      price: 10,
    });
  const id = res.body.id;
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "eewfef",
      price: 10,
    })
    .expect(401);
});

it("returns a 401 if the user provides an invalid title or price", async () => {
  const cookie = global.signin();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "bbb",
      price: -2,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 2,
    })
    .expect(400);
});
it("updates the ticket provided valid inputs", async () => {
  const cookie = global.signin();
  const createTicketRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });
  await request(app)
    .put(`/api/tickets/${createTicketRes.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "bbb",
      price: 20,
    })
    .expect(200);

  const getTicketRes = await request(app)
    .get(`/api/tickets/${createTicketRes.body.id}`)
    .send();
  expect(getTicketRes.body.title).toEqual("bbb");
  expect(getTicketRes.body.price).toEqual(20);
});


it('publishes an event', async () => {
  const cookie = global.signin();
  const createTicketRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });
  await request(app)
    .put(`/api/tickets/${createTicketRes.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "bbb",
      price: 20,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('reject update if the ticket is reserved', async () => {
  const cookie = global.signin();
  const createTicketRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "abc",
      price: 10,
    });

  const ticket = await Ticket.findById(createTicketRes.body.id)
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() })
  await ticket!.save()
  await request(app)
    .put(`/api/tickets/${createTicketRes.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "bbb",
      price: 20,
    })
    .expect(400);
})