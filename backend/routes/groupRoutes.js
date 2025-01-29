const express = require('express');
const router = express.Router();
const Group = require('../models/group');
const jwt = require('jsonwebtoken');

// Middleware para autenticação JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // Verifique se está usando a chave correta
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// ✅ GET - Listar todos os grupos
router.get('/', authenticate, async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter grupos.' });
  }
});

// ✅ POST - Criar um grupo
router.post('/', authenticate, async (req, res) => {
  const { name, description, location, date } = req.body;
  try {
    const newGroup = new Group({ name, description, location, date });
    await newGroup.save();
    res.status(201).json({ message: 'Grupo criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar grupo.' });
  }
});

// ✅ PUT - Atualizar grupo
router.put('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { name, description, location, date } = req.body;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(id, { name, description, location, date }, { new: true });
    if (!updatedGroup) return res.status(404).json({ message: 'Grupo não encontrado' });
    res.json(updatedGroup);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar grupo', error: error.message });
  }
});

// ✅ DELETE - Excluir grupo
router.delete('/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) return res.status(404).json({ message: 'Grupo não encontrado' });
    res.json({ message: 'Grupo excluído com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir grupo', error: error.message });
  }
});

module.exports = router;
