const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true }, // URL da imagem
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Relaciona com o utilizador
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Gallery', gallerySchema);
