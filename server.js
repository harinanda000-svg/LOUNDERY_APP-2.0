const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Helper to find file in __dirname or cwd
function getFilePath(filename) {
    const p1 = path.join(__dirname, filename);
    if (fs.existsSync(p1)) return p1;
    const p2 = path.join(process.cwd(), filename);
    if (fs.existsSync(p2)) return p2;
    return p1;
}

// Serve static assets
app.use(express.static(__dirname));
app.use(express.static(process.cwd()));

// Root route
app.get('/', (req, res) => {
    res.sendFile(getFilePath('index.html'));
});

// Match html routes with extension
app.get('/:page.html', (req, res) => {
    const filePath = getFilePath(`${req.params.page}.html`);
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    }
    res.status(404).send('Page not found');
});

// Match clean URL routes without extension
app.get('/home', (req, res) => res.sendFile(getFilePath('home.html')));
app.get('/booking', (req, res) => res.sendFile(getFilePath('booking.html')));
app.get('/login', (req, res) => res.sendFile(getFilePath('login.html')));
app.get('/signup', (req, res) => res.sendFile(getFilePath('signup.html')));

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
    const { email, password } = req.body || {};

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