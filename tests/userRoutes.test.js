import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

const userPayload = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Test1234',
};

describe('User Routes', () => {
  afterEach(async () => {
    await User.deleteMany(); 
  });

  afterAll(async () => {
    await mongoose.connection.close(); 
  });

  const registerAndLogin = async () => {
    // Register user
    await request(app).post('/api/users/register').send(userPayload);

    // Login user
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: userPayload.password });

    return loginRes.body.token;
  };

  it('should register a new user', async () => {
    const res = await request(app).post('/api/users/register').send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should log in an existing user', async () => {
    await request(app).post('/api/users/register').send(userPayload);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: userPayload.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get the user by ID', async () => {
    const token = await registerAndLogin();

    const user = await User.findOne({ email: userPayload.email });

    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', userPayload.email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should update the user password', async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .put('/api/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: userPayload.password,
        newPassword: 'NewPass123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password updated successfully');
  });

  it('should delete the user account', async () => {
    const token = await registerAndLogin();

    const res = await request(app)
      .delete('/api/users/delete')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User account deleted');
  });
});
