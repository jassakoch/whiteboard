import { test, expect } from '@playwright/test';

test.describe('Registration = Success Cases', () => {

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

});
});

test.describe('Registration - Error Cases', ( () => {
    //hardcoded data
    const duplicateUser = {
        firstName: "Duplicate",
        lastName: "TestLastName",
        email: "duplicateEmail@test.com",
        password: "Password123"
    };

    test.beforeAll(async ({request}) => {
        await request.post('/api/users/register', { data: duplicateUser});

    });
    test('should fail while registering a user with an existing email', async ({ request })=> {
       const response = await request.post('api/users/register', {data: duplicateUser});

    

    expect(response.status()).toBe(400);
    const body = await response.json();
    console.log("Error", body);

    expect(body.message).toBe("Email already registered");
    });

    test('should fail if the password is missing', async ({request})=> {
        const response = await request.post('/api/users/register',
{data: {firstName: "no", lastName: "Pass",email: "missingpassword@test.com"} });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.message).toBe('All fields are required');
    })

})
)
