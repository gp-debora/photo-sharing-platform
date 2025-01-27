// Verificar se o token é válido
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
      if (!response.ok) {
        throw new Error('Token inválido ou expirado.');
      }
      return true;
    } catch (error) {
      alert('Token inválido. Faça login novamente.');
      localStorage.removeItem('userToken');
      window.location.href = 'login.html';
      return false;
    }
  }
  
  // Validar token ao carregar a página
  document.addEventListener('DOMContentLoaded', async () => {
    const isValid = await validateToken();
    if (isValid) {
      fetchGroups(); 
    }
  });
  