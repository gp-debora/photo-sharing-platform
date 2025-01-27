const express = require('express');
const Share = require('../models/share'); 
const router = express.Router();

// Criar nova partilha
router.post('/', async (req, res) => {
  const { title, description, location, date } = req.body;

  try {
    const newShare = new Share({ title, description, location, date, user: req.user.id });
    await newShare.save();
    res.status(201).json(newShare);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar partilha.' });
  }
});

// Listar todas as partilhas
router.get('/', async (req, res) => {
  try {
    const shares = await Share.find();
    res.status(200).json(shares);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar partilhas.' });
  }
});

//Salvar partilha
async function salvarPartilha() {
  const titulo = document.getElementById('share-title').value;
  const descricao = document.getElementById('share-description').value;
  const local = document.getElementById('share-location').value;
  const data = document.getElementById('share-date').value;
  const token = localStorage.getItem('userToken');

  try {
    const response = await fetch('http://localhost:5001/api/shares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ titulo, descricao, local, data }),
    });

    if (response.ok) {
      alert('Partilha criada com sucesso!');
      document.getElementById('share-title').value = '';
      document.getElementById('share-description').value = '';
      document.getElementById('share-location').value = '';
      document.getElementById('share-date').value = '';
    } else {
      const error = await response.json();
      alert(`Erro ao criar partilha: ${error.message}`);
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao criar partilha.');
  }
}


module.exports = router;
