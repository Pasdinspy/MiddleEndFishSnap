const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const predictionSchema = new Schema({
  imageId: { type: String, required: true },
  species: { type: String, required: true },
  confidence: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  originalImage: String,
  processedImage: String
});

const Prediction = mongoose.model('Prediction', predictionSchema);

module.exports = { Prediction };
