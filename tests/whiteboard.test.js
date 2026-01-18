import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';
import Whiteboard from '../models/Whiteboard.js';
import User from '../models/User.js';

let testWhiteboard;
let testUser;
let token;


beforeAll(async () => {
  // Only connect if not already connected
  if (mongoose.connection.readyState === 0) {
    const MONGO_URI = process.env.MONGO_URI_TEST;
    await mongoose.connect(MONGO_URI);
    console.log("Connected to test database");
  }

//uniqueEmail
const uniqueEmail = `test_${Date.now()}@test.com`

  // Create a test user
  testUser = await User.create({
    firstName: 'Test',
    lastName: 'User',
    email: uniqueEmail,
    password: 'Test1234'
  });

  // Generate a token for the test user
  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Create a whiteboard for testing
  testWhiteboard = await Whiteboard.create({ title: 'Test Whiteboard', createdBy: testUser._id });

  console.log("Test Whiteboard:", testWhiteboard);

});




//POST test
describe('POST /api/whiteboard', () => {
  it('should create a new whiteboard', async () => {
    const response = await request(app)
      .post('/api/whiteboard')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New Test Whiteboard' })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('New Test Whiteboard');
    expect(response.body.createdBy).toBe(testUser._id.toString());
  });

  it('should return a 400 error if title is missing', async () => {
    const response = await request(app)
      .post('/api/whiteboard')
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(response.body.message).toBe('Title is required.');
  });

  it('should add number suffix for duplicate titles', async () => {
    const response1 = await request(app)
      .post('/api/whiteboard')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Duplicate Title' })
      .expect(201);

    const response2 = await request(app)
      .post('/api/whiteboard')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Duplicate Title' })
      .expect(201);

    expect(response1.body.title).toBe('Duplicate Title');
    expect(response2.body.title).toBe('Duplicate Title [1]');
  });
});

//GET test
describe('GET /api/whiteboard', () => {
  it('should return all whiteboards for the logged-in user', async () => {
    const response = await request(app)
      .get('/api/whiteboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('GET /api/whiteboard/:id', () => {
  it('should return a whiteboard by ID', async () => {
    console.log("Testing GET route with ID:", testWhiteboard._id);

    const response = await request(app)
      .get(`/api/whiteboard/${testWhiteboard._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.title).toBe('Test Whiteboard');
    expect(response.body.createdBy).toBe(testUser._id.toString());
  });

  it('should return 404 if whiteboard not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .get(`/api/whiteboard/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body.message).toBe('Whiteboard not found');
  });
});

describe('DELETE /api/whiteboard/:id', () => {
  it('should delete a whiteboard by ID', async () => {
    // First, create a whiteboard to test with
    const whiteboardToDelete = await Whiteboard.create({ title: 'Delete Test', createdBy: testUser._id });

    const response = await request(app)
      .delete(`/api/whiteboard/${whiteboardToDelete._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.message).toBe('Whiteboard deleted');
  });

  it('should return 404 if whiteboard not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/api/whiteboard/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(response.body.message).toBe('Whiteboard not found');
  });

  it('should return 403 if user is not the owner', async () => {
    // Create another user
    const otherUser = await User.create({
      firstName: 'Other',
      lastName: 'User',
      email: 'other@example.com',
      password: 'Other1234'
    });
    const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a whiteboard owned by the first user
    const whiteboard = await Whiteboard.create({ title: 'Owned by test user', createdBy: testUser._id });

    const response = await request(app)
      .delete(`/api/whiteboard/${whiteboard._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403);

    expect(response.body.message).toBe('Not authorized');

    // Clean up
    await User.deleteOne({ _id: otherUser._id });
  });
});

describe('PUT /api/whiteboard/:id', () => {
  it('should update a whiteboard title', async () => {
    const updatedData = { title: 'Updated Title' };

    const response = await request(app)
      .put(`/api/whiteboard/${testWhiteboard._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.title).toBe('Updated Title');
  });

  it('should return 404 if whiteboard not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .put(`/api/whiteboard/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Does not matter' })
      .expect(404);

    expect(response.body.message).toBe('Whiteboard not found');
  });

  it('should return 403 if user is not the owner', async () => {
    // Create another user
    const otherUser = await User.create({
      firstName: 'Other',
      lastName: 'User',
      email: 'other2@example.com',
      password: 'Other1234'
    });
    const otherToken = jwt.sign({ id: otherUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Create a whiteboard owned by the first user
    const whiteboard = await Whiteboard.create({ title: 'Owned by test user', createdBy: testUser._id });

    const response = await request(app)
      .put(`/api/whiteboard/${whiteboard._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked title' })
      .expect(403);

    expect(response.body.message).toBe('Not authorized');

    // Clean up
    await User.deleteOne({ _id: otherUser._id });
  });
});

afterAll(async () => {
  try {
await Whiteboard.deleteMany({createdBy: testUser._id });
await User.deleteMany({ _id: testUser._id });

  await mongoose.connection.close();
console.log("Test database connection closed.");
  } catch (err) {
    console.error("Cleanup failed:", err);
  }
  
});

