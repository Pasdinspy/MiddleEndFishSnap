const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetch = require('node-fetch');
const { Image, Prediction } = require('../models/schema');
const FormData = require('form-data');
const mongoose = require('mongoose');

// Configuration de multer pour le stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Schéma pour les espèces de poissons
const fishSpeciesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  wikiUrl: { type: String, required: true },
  habitat: String,
  averageSize: String,
  distribution: String
});

const FishSpecies = mongoose.model('FishSpecies', fishSpeciesSchema);

// Route pour récupérer toutes les espèces de poissons
router.get('/fish-species', async (req, res) => {
  try {
    const species = await FishSpecies.find();
    res.json(species);
  } catch (error) {
    console.error('Erreur lors de la récupération des espèces:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route pour récupérer une espèce spécifique
router.get('/fish-species/:id', async (req, res) => {
  try {
    const species = await FishSpecies.findById(req.params.id);
    if (!species) {
      return res.status(404).json({ error: 'Espèce non trouvée' });
    }
    res.json(species);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'espèce:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route existante pour la prédiction
router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    // 1. Save image to MongoDB
    const image = new Image({
      uri: req.file.buffer.toString('base64'),
      type: req.file.mimetype,
      size: req.file.size,
      location: req.body.latitude && req.body.longitude ? {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      } : undefined
    });
    await image.save();

    // 2. Send image to Python API
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'photo.jpg',
      contentType: 'image/jpeg'
    });

    const pythonApiResponse = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    if (!pythonApiResponse.ok) {
      throw new Error(`Python API error: ${pythonApiResponse.status}`);
    }

    const predictionResult = await pythonApiResponse.json();

    // 3. Save prediction
    const prediction = new Prediction({
      imageId: image._id,
      species: predictionResult.espece,
      confidence: predictionResult.prediction,
      originalImage: image.uri,
      processedImage: predictionResult.image,
      location: image.location
    });
    await prediction.save();

    // 4. Update image with prediction reference
    image.predictions.push(prediction._id);
    await image.save();

    res.json({
      prediction: predictionResult,
      id: prediction._id
    });
  } catch (error) {
    console.error('Error in /predict:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;