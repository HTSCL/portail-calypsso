const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/calypsso';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

// Schémas MongoDB
const PersonneRechercheSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  motifRecherche: String,
  dangereux: Boolean,
  description: String,
  dateAjout: { type: Date, default: Date.now }
});

const PermisConduireSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  numeroPermis: String,
  categoriesPermis: [String],
  validite: Boolean,
  dateObtention: Date,
  points: { type: Number, default: 12 }
});

const VehiculeSchema = new mongoose.Schema({
  marque: String,
  modele: String,
  plaqueImmatriculation: String,
  couleur: String,
  annee: Number,
  proprietaire: String,
  assure: Boolean,
  dateAssurance: Date,
  vole: { type: Boolean, default: false }
});

const TAJSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  dateNaissance: Date,
  photographie: String,
  antecedents: [{
    date: Date,
    infraction: String,
    lieu: String,
    service: String
  }],
  dateAjout: { type: Date, default: Date.now }
});

const ObjetSignaleSchema = new mongoose.Schema({
  type: String, // véhicule, bateau, aéronef, objet
  description: String,
  plaqueImmatriculation: String,
  marque: String,
  modele: String,
  statut: String, // volé, perdu, sous surveillance
  dateSignalement: { type: Date, default: Date.now },
  signalePar: String
});

// Modèles
const PersonneRecherche = mongoose.model('PersonneRecherche', PersonneRechercheSchema);
const PermisConduire = mongoose.model('PermisConduire', PermisConduireSchema);
const Vehicule = mongoose.model('Vehicule', VehiculeSchema);
const TAJ = mongoose.model('TAJ', TAJSchema);
const ObjetSignale = mongoose.model('ObjetSignale', ObjetSignaleSchema);

// Routes API

// FPR - Fichier des Personnes Recherchées
app.get('/api/fpr/search', async (req, res) => {
  try {
    const { nom, prenom, dateNaissance } = req.query;
    const query = {};
    if (nom) query.nom = new RegExp(nom, 'i');
    if (prenom) query.prenom = new RegExp(prenom, 'i');
    if (dateNaissance) query.dateNaissance = new Date(dateNaissance);
    
    const resultats = await PersonneRecherche.find(query);
    res.json({ success: true, resultats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/fpr/add', async (req, res) => {
  try {
    const personne = new PersonneRecherche(req.body);
    await personne.save();
    res.json({ success: true, personne });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SNPC - Système National du Permis de Conduire
app.get('/api/snpc/search', async (req, res) => {
  try {
    const { nom, prenom, dateNaissance } = req.query;
    const query = {};
    if (nom) query.nom = new RegExp(nom, 'i');
    if (prenom) query.prenom = new RegExp(prenom, 'i');
    if (dateNaissance) query.dateNaissance = new Date(dateNaissance);
    
    const resultats = await PermisConduire.find(query);
    res.json({ success: true, resultats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/snpc/add', async (req, res) => {
  try {
    const permis = new PermisConduire(req.body);
    await permis.save();
    res.json({ success: true, permis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// SIV - Système d'Immatriculation des Véhicules
app.get('/api/siv/search', async (req, res) => {
  try {
    const { marque, modele, plaqueImmatriculation } = req.query;
    const query = {};
    if (marque) query.marque = new RegExp(marque, 'i');
    if (modele) query.modele = new RegExp(modele, 'i');
    if (plaqueImmatriculation) query.plaqueImmatriculation = new RegExp(plaqueImmatriculation, 'i');
    
    const resultats = await Vehicule.find(query);
    res.json({ success: true, resultats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/siv/add', async (req, res) => {
  try {
    const vehicule = new Vehicule(req.body);
    await vehicule.save();
    res.json({ success: true, vehicule });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// TAJ - Traitement d'Antécédents Judiciaires
app.get('/api/taj/search', async (req, res) => {
  try {
    const { nom, prenom, dateNaissance } = req.query;
    const query = {};
    if (nom) query.nom = new RegExp(nom, 'i');
    if (prenom) query.prenom = new RegExp(prenom, 'i');
    if (dateNaissance) query.dateNaissance = new Date(dateNaissance);
    
    const resultats = await TAJ.find(query);
    res.json({ success: true, resultats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/taj/add', async (req, res) => {
  try {
    const taj = new TAJ(req.body);
    await taj.save();
    res.json({ success: true, taj });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// FVA - Fichier des Véhicules Assurés
app.get('/api/fva/search', async (req, res) => {
  try {
    const { plaqueImmatriculation } = req.query;
    const vehicule = await Vehicule.findOne({ 
      plaqueImmatriculation: new RegExp(plaqueImmatriculation, 'i') 
    });
    
    if (vehicule) {
      res.json({ 
        success: true, 
        assure: vehicule.assure,
        dateAssurance: vehicule.dateAssurance,
        vehicule 
      });
    } else {
      res.json({ success: false, message: 'Véhicule non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// FOVeS - Fichier des Objets et des Véhicules Signalés
app.get('/api/foves/search', async (req, res) => {
  try {
    const { marque, modele, plaqueImmatriculation, type } = req.query;
    const query = {};
    if (marque) query.marque = new RegExp(marque, 'i');
    if (modele) query.modele = new RegExp(modele, 'i');
    if (plaqueImmatriculation) query.plaqueImmatriculation = new RegExp(plaqueImmatriculation, 'i');
    if (type) query.type = type;
    
    const resultats = await ObjetSignale.find(query);
    res.json({ success: true, resultats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/foves/add', async (req, res) => {
  try {
    const objet = new ObjetSignale(req.body);
    await objet.save();
    res.json({ success: true, objet });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Route pour la page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur Calypsso démarré sur le port ${PORT}`);
});
