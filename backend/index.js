const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const authRoutes = require('./routes/authRoutes');
const shareRoutes = require('./routes/shareRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api', authRoutes); 
app.use('/api/shares', shareRoutes);
app.use('/api/gallery', galleryRoutes);

// Inicializar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
