const express = require('express');
const Gallery = require('../models/gallery'); 
const router = express.Router();
const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido.' });

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); 
    req.user = decoded;  // Armazena os dados do usuário autenticado
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// Criar nova imagem na galeria
router.post('/', authenticate, async (req, res) => {
  const { imageUrl, description } = req.body;

  if (!imageUrl || !description) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  console.log("Usuário autenticado:", req.user); // Verifica se o usuário está autenticado corretamente

  try {
    const newImage = new Gallery({ 
      imageUrl, 
      description, 
      user: req.user.id // Garantir que req.user.id está definido
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    console.error("Erro ao adicionar imagem:", error);
    res.status(500).json({ error: 'Erro ao adicionar imagem na galeria.' });
  }
});

// Listar todas as imagens
router.get('/', authenticate, async (req, res) => {
  try {
    const images = await Gallery.find();
    res.status(200).json(images);
  } catch (error) {
    console.error("Erro ao listar imagens:", error);
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
