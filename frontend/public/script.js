// URLs da API
const API_BASE_URL = 'http://localhost:5001/api/users';


async function validateToken() {
  const token = localStorage.getItem('userToken');
  if (!token) {
    alert('Token não encontrado. Faça login novamente.');
    window.location.href = 'login.html';
    return false;
  }

  try {
    const response = await fetch('http://localhost:5001/api/validateToken', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Token inválido ou expirado.');
    return true;
  } catch (error) {
    alert('Token inválido. Faça login novamente.');
    localStorage.removeItem('userToken');
    window.location.href = 'login.html';
    return false;
  }
}

// Função de registo
async function handleRegister(event) {
  event.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      alert('Registo bem-sucedido!');
      window.location.href = 'index.html';
    } else {
      const error = await response.json();
      alert(`Erro no registo: ${error.message}`);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Função de login
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert('Login bem-sucedido!');
        // Salvar o token no localStorage
        localStorage.setItem('userToken', data.token);
  
        // Redirecionar para a página principal
        window.location.href = 'index.html';
      } else {
        const errorData = await response.json();
        alert(`Erro ao fazer login: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Erro ao realizar o login:', error);
      alert('Ocorreu um erro inesperado. Tente novamente mais tarde.');
    }
  });

  

// Função de Logout
function handleLogout() {
    alert('Logout realizado com sucesso!');
    // Redireciona para a página de login
    window.location.href = 'login.html';
  }
  

// Eventos
document.getElementById('register-form').addEventListener('submit', handleRegister);
document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);

