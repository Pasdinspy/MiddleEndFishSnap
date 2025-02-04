const mongoose = require('mongoose');
const connectDB = require('./src/config/database');

// Définir le schéma
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

// Créer le modèle
mongoose.model('FishSpecies', fishSpeciesSchema);

const fishSpeciesData = [
  {
    name: "Poisson rouge",
    scientificName: "Carassius auratus",
    description: "Le poisson rouge est un poisson d'eau douce populaire en aquarium, reconnaissable à sa couleur orange vive.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Goldfish3.jpg/240px-Goldfish3.jpg",
    wikiUrl: "https://fr.wikipedia.org/wiki/Poisson_rouge",
    habitat: "Eaux douces stagnantes et bassins",
    averageSize: "10-30 cm",
    distribution: "Originaire d'Asie de l'Est, domestiqué dans le monde entier"
  },
  {
    name: "Raie",
    scientificName: "Batoidea",
    description: "Les raies sont des poissons cartilagineux aplatis, apparentés aux requins, vivant principalement sur les fonds marins.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Raie_des_Antilles_.jpg/800px-Raie_des_Antilles_.jpg?20190904023859",
    wikiUrl: "https://fr.wikipedia.org/wiki/Raie",
    habitat: "Fonds marins, océans et mers",
    averageSize: "50 cm - 7 m selon les espèces",
    distribution: "Océans et mers du monde entier"
  }
];

const seedDatabase = async () => {
  try {
    // Connexion à la base de données
    await connectDB();
    
    // Récupération du modèle
    const FishSpecies = mongoose.model('FishSpecies');
    
    // Suppression des données existantes
    await FishSpecies.deleteMany({});
    console.log('Collection nettoyée');
    
    // Insertion des nouvelles données
    const result = await FishSpecies.insertMany(fishSpeciesData);
    console.log(`${result.length} espèces de poissons ajoutées à la base de données`);
    
    // Déconnexion
    await mongoose.disconnect();
    console.log('Base de données mise à jour avec succès');
    
  } catch (error) {
    console.error('Erreur lors du seeding de la base de données:', error);
    process.exit(1);
  }
};

seedDatabase();
