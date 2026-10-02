const users = [
    {
        email: 'user@eliteclean.com',
        password: '123456',
        name: 'Elite Clean User'
    }
];

module.exports = (req, res) => {
    // Handle CORS if needed
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }

    const { email, password } = req.body || {};

    const user = users.find(
        (item) => item.email === email && item.password === password
    );

    if (user) {
        return res.status(200).json({
            success: true,
            message: `Welcome, ${user.name}!`,
            user: {
                name: user.name,
                email: user.email
            }
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
    });
};
