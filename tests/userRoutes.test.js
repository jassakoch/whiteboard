import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

describe('User Routes', () => {
  beforeAll(async () => {
    // Optional: connect to a test DB if you're not using the same one
  });

  afterEach(async () => {
    await User.deleteMany(); // Clean DB after each test
  });

  afterAll(async () => {
    await mongoose.connection.close(); 
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Test1234',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  }, 10000);
});
