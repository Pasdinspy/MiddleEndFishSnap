const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

const Image = mongoose.model('Image', imageSchema);

module.exports = { Image };
