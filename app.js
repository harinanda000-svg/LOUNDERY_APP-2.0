const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

if (loginForm && errorMsg) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');

        if (!emailInput || !passwordInput) {
            errorMsg.textContent = 'Form fields are missing from the page.';
            errorMsg.classList.remove('hidden');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        errorMsg.classList.add('hidden');
        if (successMsg) successMsg.classList.add('hidden');

        // 1. Check local signups in localStorage first
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const matchedLocalUser = localUsers.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (matchedLocalUser) {
            localStorage.setItem('currentUser', JSON.stringify({
                name: matchedLocalUser.name || 'User',
                email: matchedLocalUser.email
            }));
            if (successMsg) {
                successMsg.textContent = `Welcome back, ${matchedLocalUser.name || 'User'}!`;
                successMsg.classList.remove('hidden');
            }
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 300);
            return;
        }

        // 2. Demo User fast path
        if (email.toLowerCase() === 'user@eliteclean.com' && password === '123456') {
            localStorage.setItem('currentUser', JSON.stringify({
                name: 'Elite Clean User',
                email: 'user@eliteclean.com'
            }));
            if (successMsg) {
                successMsg.textContent = 'Welcome back, Elite Clean User!';
                successMsg.classList.remove('hidden');
            }
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 300);
            return;
        }

        // 3. Server API check
        const loginUrl = window.location.protocol.startsWith('http') ? '/login' : 'http://localhost:3000/login';

        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                if (successMsg) {
                    successMsg.textContent = data.message || 'Login successful!';
                    successMsg.classList.remove('hidden');
                }
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 300);
            } else {
                errorMsg.textContent = data.message || 'Invalid email or password.';
                errorMsg.classList.remove('hidden');
            }
        } catch (error) {
            errorMsg.textContent = 'Invalid email or password.';
            errorMsg.classList.remove('hidden');
        }
    });
} else {
    console.warn('Login form or error message element not found.');
}
