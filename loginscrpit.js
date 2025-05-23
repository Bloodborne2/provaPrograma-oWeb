document.getElementById('loginForm').addEventListener('submit', handleLogin);
function handleLogin(event) {
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Credenciais fixas
    const validUser = 'admin';
    const validPass = '1234';

    if (user === validUser && pass === validPass) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'menus.html';
    } else {
        document.getElementById('error-message').textContent = 'Usuário ou senha inválidos.';
    }
}
