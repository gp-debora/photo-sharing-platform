const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const router = express.Router();

// Rota para registar um novo utilizador
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'Utilizador registado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registar o utilizador.' });
  }
});

// Rota para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Senha inválida.' });

    const token = jwt.sign({ id: user._id }, 'SECRET_KEY', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao autenticar o utilizador.' });
  }
});

// Rota para validar token
router.get('/validateToken', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrai o token do cabeçalho

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // Verifica e descodifica o token
    res.status(200).json({ message: 'Token válido.', decoded });
  } catch (error) {
    res.status(403).json({ error: 'Token inválido ou expirado.' });
  }
});

// Endpoint para validar o token
router.get('/validateToken', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); 
    res.status(200).json({ valid: true, userId: decoded.id });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
});


module.exports = router;
