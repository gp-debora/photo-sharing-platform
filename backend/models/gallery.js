const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, 
  description: { type: String, required: true },
  title: { type: String, required: true }, // <-- Provavelmente, está exigindo esse campo
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Gallery', GallerySchema);
