import { test, expect } from '@playwright/test';

test('Register a new user', async ({ request}) => {

    //ARRANGE
    const timestamp = Date.now();
    const testUser = {
        firstName: "Junior",
        lastName: "Engineer",
        email: `Milo_${timestamp}@test.com`,
        password: "Password123"
    };

    let token

    //ACT
    const response = await request.post('api/users/register', {
        data: testUser
    }); 


//ASSERT
expect(response.status()).toBe(201);
const body = await response.json();
console.log('Register body:', body);
expect(body.message).toBe("User registered successfully");

}) 