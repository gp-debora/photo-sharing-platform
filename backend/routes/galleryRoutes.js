const express = require('express');
const Gallery = require('../models/gallery'); // Importar modelo de Galeria
const router = express.Router();

// Criar nova imagem na galeria
router.post('/', async (req, res) => {
  const { imageUrl, description } = req.body;

  try {
    const newImage = new Gallery({ imageUrl, description, user: req.user.id });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar imagem na galeria.' });
  }
});

// Listar todas as imagens
router.get('/', async (req, res) => {
  try {
    const images = await Gallery.find();
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar imagens.' });
  }
});

//Salvar imagem
async function salvarImagem() {
    const url = document.getElementById('image-url').value;
    const descricao = document.getElementById('image-description').value;
    const token = localStorage.getItem('userToken');
  
    try {
      const response = await fetch('http://localhost:5001/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url, descricao }),
      });
  
      if (response.ok) {
        alert('Imagem adicionada com sucesso!');
        document.getElementById('image-url').value = '';
        document.getElementById('image-description').value = '';
      } else {
        const error = await response.json();
        alert(`Erro ao adicionar imagem: ${error.message}`);
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar imagem.');
    }
  }
  

module.exports = router;
