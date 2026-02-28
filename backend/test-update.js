const axios = require('axios');

async function testUpdate() {
    try {
        // 1. Login to get a token
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'test@example.com', // Need a valid user, or I'll just register one
            password: 'password123'
        }).catch(async (err) => {
            // Register if not found
            return await axios.post('http://localhost:5000/api/auth/register', {
                name: 'Test',
                email: 'test@example.com',
                password: 'password123',
                age: 25,
                weight: 70,
                height: 175,
                gender: 'male',
                goal: 'Fat Loss',
                activityLevel: 1.55,
                equipment: 'None',
                experienceLevel: 'Beginner'
            });
        });

        const token = loginRes.data.token;
        console.log("Logged in!");

        // 2. Try to update
        const payload = {
            name: "Test Update",
            age: 26,
            weight: 71,
            height: 175,
            goal: 'Fat Loss',
            activityLevel: 1.55,
            equipment: 'None',
            experienceLevel: 'Beginner',
            gender: 'male'
        };

        const updateRes = await axios.put('http://localhost:5000/api/users/profile', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Success:", updateRes.data);
    } catch (err) {
        console.error("PUT Failed:", err.response?.data?.message || err.message);
    }
}

testUpdate();
