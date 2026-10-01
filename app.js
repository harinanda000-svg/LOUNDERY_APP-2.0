const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');

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
                window.location.href = 'home.html';
            } else {
                errorMsg.textContent = data.message || 'Invalid email or password.';
                errorMsg.classList.remove('hidden');
            }
        } catch (error) {
            errorMsg.textContent = 'Unable to connect to the server.';
            errorMsg.classList.remove('hidden');
        }
    });
} else {
    console.warn('Login form or error message element not found.');
}
