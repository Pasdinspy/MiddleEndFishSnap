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
    coordinates: [Number] // [longitude, latitude]
  },
  originalImage: String,
  processedImage: String
});

const imageSchema = new Schema({
  uri: { type: String, required: true },
  type: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: [Number]
  },
  predictions: [{ type: Schema.Types.ObjectId, ref: 'Prediction' }]
});

module.exports = {
  Prediction: mongoose.model('Prediction', predictionSchema),
  Image: mongoose.model('Image', imageSchema)
};