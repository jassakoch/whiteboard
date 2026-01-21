import { test, expect } from '@playwright/test';




// This is the part Playwright was complaining about
test.describe('Authentication Lifecycle: Postman Flow', async ({request}) => {
// ARRANGE
const timestamp = Date.now();
const testUser = {
  firstName: "Junior",
  lastName: "Engineer",
  email: `candidate_${timestamp}@work.com`,
  password: "SecurePassword123"
};

let token;


  await test.step('Step 1: Register a new User', async () => {
    // ACT
    const response = await request.post('/api/users/register', {
      data: testUser
    });

    // ASSERT
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.message).toBe("User registered successfully");
  });


  await test.step('Step 2: Login and Capture JWT', async ()=> {
    //ACT
const response = await request.post('/api/users/login', {
    data: {
       email: testUser.email,
       password: testUser.password
    }
} );

//ASSERT
expect(response.status()).toBe(200);
const body = await response.json();

expect(body).toHaveProperty('token')
token = body.token //Save it for the next "Act"
expect(token).toBeDefined();
});

await test.step('Step 3: Access a protected route with the token', async () => {
    const response = await request.get('/api/users/me', {
            headers: {
'Authorization': `Bearer ${authToken}`
            }
        })
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.email).toBe(testUser.email);
    })
});