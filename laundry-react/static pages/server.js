const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Allows Express to read JSON sent from login.html
app.use(express.json());

// Makes your current project folder available in the browser
app.use(express.static(__dirname));

// Demo users for Express login
const users = [
    {
        email: 'user@eliteclean.com',
        password: '123456',
        name: 'Elite Clean User'
    }
];

// Login API route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(
        (item) => item.email === email && item.password === password
    );

    if (user) {
        return res.json({
            success: true,
            message: `Welcome, ${user.name}!`,
            user: {
                name: user.name,
                email: user.email
            }
        });
    }

    res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});