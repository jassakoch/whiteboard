import mongoose from 'mongoose';
import request from 'supertest';
import app from '../server.js';
import Whiteboard from '../models/Whiteboard.js';

let testWhiteboard;


beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI_TEST;
  await mongoose.connect(MONGO_URI);

  // Create a whiteboard for testing
  testWhiteboard = await Whiteboard.create({ title: 'Test Whiteboard', createdBy: 'Test User' });

  console.log("Connected to test database");
  console.log("Test Whiteboard:", testWhiteboard);

});


afterAll(async () => {
  await Whiteboard.deleteMany(); // Clean up test data
  await mongoose.connection.close();
});


//POST test
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

//GET test
describe('GET/api/whiteboard/:id', () => {
  it('should return a whiteboard by ID', async () => {
    console.log("Testing GET route with ID:", testWhiteboard._id);

   
    const response = await request(app)

    .get(`/api/whiteboard/${testWhiteboard._id}`)
    .expect(200);

    expect(response.body.title).toBe('Test Whiteboard');
    expect(response.body.createdBy).toBe('Test User');
  });

  it ('should return 404 if whiteboard not found', async () => {
    const fakeId = '83hjkd982389hcd83j94j'
    const response = await request(app)
    .get(`/api/whiteboard/${fakeId}`)
      .expect(404);

      expect(response.body.message).toBe('Whiteboard not found');
    
  });

});

describe('DELETE /api/whiteboard/:id', () => {
  it('should delete a whiteboard by ID', async () => {
    // First, create a whiteboard to test with
    const whiteboardToDelete = await Whiteboard.create({ title: 'Delete Test', createdBy: 'Test User' });

    const response = await request(app)
      .delete(`/api/whiteboard/${whiteboardToDelete._id}`)
      .expect(200);

    expect(response.body.message).toBe('Whiteboard deleted');
  });

  it('should return 404 if whiteboard not found', async () => {
    const fakeId = new mongoose.Types.ObjectId();//An ID that doesn't exist
    const response = await request(app)
      .delete(`/api/whiteboard/${fakeId}`)
      .expect(404);

    expect(response.body.message).toBe('Whiteboard not found');
  });
});
