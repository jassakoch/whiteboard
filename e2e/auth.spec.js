import { test, expect } from '@playwright/test';

// ARRANGE
const timestamp = Date.now();
const testUser = {
  firstName: "Junior",
  lastName: "Engineer",
  email: `candidate_${timestamp}@work.com`,
  password: "SecurePassword123"
};

// This is the part Playwright was complaining about
test.describe('Authentication API', () => {

  test('should register a new user', async ({ request }) => {
    // ACT
    const response = await request.post('/api/users/register', {
      data: testUser
    });

    // ASSERT
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe("User registered successfully");
  });

});