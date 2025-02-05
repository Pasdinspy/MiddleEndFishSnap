const express = require('express');
const router = express.Router();
const multer = require('multer');
const fetch = require('node-fetch');
const { Prediction } = require('../models/predictionModel');
const { Image } = require('../models/imageModel');
const { FishSpecies } = require('../models/fishSpeciesModel');
const FormData = require('form-data');

// Configuration de multer pour le stockage en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

// Route pour la prédiction
router.post('/predict', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);
    const location =
      !isNaN(latitude) && !isNaN(longitude)
        ? { type: 'Point', coordinates: [longitude, latitude] }
        : undefined;

    // 1. Sauvegarde de l'image dans MongoDB
    const image = new Image({
      uri: req.file.buffer.toString('base64'),
      type: req.file.mimetype,
      size: req.file.size,
      location,
    });
    await image.save();

    // 2. Envoi de l'image à l'API Python
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: 'photo.jpg',
      contentType: req.file.mimetype,
    });

    const pythonApiResponse = await fetch('http://localhost:5000/predict', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!pythonApiResponse.ok) {
      throw new Error(`Erreur de l'API Python: ${pythonApiResponse.status}`);
    }

    const predictionResult = await pythonApiResponse.json();

    // 3. Sauvegarde de la prédiction
    const prediction = new Prediction({
      imageId: image._id,
      species: predictionResult.espece,
      confidence: predictionResult.prediction,
      originalImage: image.uri,
      processedImage: predictionResult.image,
      location: image.location,
    });
    await prediction.save();

    res.json({
      prediction: predictionResult,
      id: prediction._id,
    });
  } catch (error) {
    console.error('Erreur dans /predict:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;