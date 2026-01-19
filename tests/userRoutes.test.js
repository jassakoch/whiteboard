import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

describe('User Routes', () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  
  const registerAndLogin = async (email = 'test@example.com') => {

    const uniqueEmail = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@test.com`

    const userPayload = {
      firstName: 'Test',
      lastName: 'User',
      email:uniqueEmail,
      password: 'Test1234',
    };

    // Register user
    await request(app).post('/api/users/register').send(userPayload);

    // Login user
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: userPayload.password });

    return { token: loginRes.body.token, email: userPayload.email };
  };

  it('should register a new user', async () => {
    const userPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'register@example.com',
      password: 'Test1234',
    };
    const res = await request(app).post('/api/users/register').send(userPayload);
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should log in an existing user', async () => {
    const userPayload = {
      firstName: 'Test',
      lastName: 'User',
      email: 'login@example.com',
      password: 'Test1234',
    };
    await request(app).post('/api/users/register').send(userPayload);

    const res = await request(app)
      .post('/api/users/login')
      .send({ email: userPayload.email, password: userPayload.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login successful');
  });

  it('should get the current user', async () => {
    const { token, email } = await registerAndLogin('me@example.com');

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', email);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should update the user password', async () => {
    const { token } = await registerAndLogin('updatepass@example.com');

    const res = await request(app)
      .put('/api/users/update-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        currentPassword: 'Test1234',
        newPassword: 'NewPass123!',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Password updated successfully');
  });

  it('should delete the user account', async () => {
    const { token } = await registerAndLogin('delete@example.com');

    const res = await request(app)
      .delete('/api/users/delete')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('User account deleted');
  });
});
