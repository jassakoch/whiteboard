import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';
import Whiteboard from '../models/Whiteboard.js';

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI_TEST;
  await mongoose.connect(MONGO_URI);
//    { useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }

  console.log("Connected to test database");

});

afterAll(async () => {
  await Whiteboard.deleteMany(); // Clean up test data
  await mongoose.connection.close();
});

describe('POST /api/whiteboard', () => {
  it('should create a new whiteboard', async () => {
    const response = await request(app)
      .post('/api/whiteboard')
      .send({ title: 'Test Whiteboard', createdBy: 'Test User' })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Whiteboard');
    expect(response.body.createdBy).toBe('Test User');
  });

  it('should return a 400 error if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/whiteboard')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('Title and CreatedBy are required.');
  });
});
