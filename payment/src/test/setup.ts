import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'

declare global {
  var signin: (userId?: string) => string[];
}

jest.mock('../nats-wrapper')

process.env.STRIPE_KEY = 'sk_test_51MXcaCCpw0HBfWhPJRsDlBYZMmAuonVS1udo1IFBfHJQX0tSkJ23QAIN0zUPNCAulQjVw9aAavrkMjGnvbfFoYCH009cKtBhXa'
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "adfsff";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = (id?: string ) => {
  const payload = {
    email: 'test@gmail.com',
    id: id || new mongoose.Types.ObjectId().toHexString()
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  const session = { jwt: token }
  const sessionJSON= JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`session=${base64}`]
};
