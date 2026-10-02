const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Dynamic route for html files
app.get('/:page.html', (req, res) => {
    res.sendFile(path.join(__dirname, `${req.params.page}.html`));
});

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

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;