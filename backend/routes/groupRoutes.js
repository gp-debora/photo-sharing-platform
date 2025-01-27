const express = require('express');
const router = express.Router();
const Group = require('../models/group');

// Middleware de autenticação
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); // Use a mesma SECRET_KEY
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// Rota para obter todos os grupos
router.get('/groups', authenticate, async (req, res) => {
  try {
    const groups = await Group.find();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter grupos.' });
  }
});

// Rota para criar um grupo
router.post('/groups', authenticate, async (req, res) => {
  const { name, description, location, date } = req.body;
  try {
    const newGroup = new Group({ name, description, location, date });
    await newGroup.save();
    res.status(201).json({ message: 'Grupo criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar grupo.' });
  }
});

module.exports = router;


// Atualizar um grupo existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, location, date } = req.body;
  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      id,
      { name, description, location, date },
      { new: true } // Retorna o grupo atualizado
    );
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    res.json(updatedGroup);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar grupo', error: err.message });
  }
});

// Excluir um grupo existente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Grupo não encontrado' });
    }
    res.json({ message: 'Grupo excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir grupo', error: err.message });
  }
});

module.exports = router;
