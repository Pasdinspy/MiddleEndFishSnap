const mongoose = require('mongoose');

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

module.exports = { FishSpecies };
