# 🛡️ Portail Calypsso

Système national d'information policière avec 6 fichiers interconnectés pour Roblox.

## 📋 Fichiers disponibles

1. **FPR** - Fichier des Personnes Recherchées
2. **SNPC** - Système National du Permis de Conduire
3. **SIV** - Système d'Immatriculation des Véhicules
4. **TAJ** - Traitement d'Antécédents Judiciaires
5. **FVA** - Fichier des Véhicules Assurés
6. **FOVeS** - Fichier des Objets et des Véhicules Signalés

## 🚀 Déploiement sur Render

### Étape 1: Créer une base de données MongoDB

1. Aller sur [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte gratuit
3. Créer un nouveau cluster (gratuit)
4. Créer un utilisateur de base de données
5. Autoriser l'accès depuis n'importe où (0.0.0.0/0)
6. Copier la chaîne de connexion

### Étape 2: Déployer sur Render

1. Créer un compte sur [Render](https://render.com)
2. Cliquer sur "New +" → "Web Service"
3. Connecter votre repository GitHub ou GitLab
4. Configuration:
   - **Name**: calypsso-portail
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Étape 3: Variables d'environnement

Dans Render, aller dans "Environment" et ajouter:
- `MONGODB_URI`: Votre chaîne de connexion MongoDB
- `PORT`: 3000 (optionnel, Render le configure automatiquement)

### Étape 4: Déployer

Cliquer sur "Create Web Service" et attendre que le déploiement se termine.

## 🔗 Connexion avec Roblox

### Script Roblox pour se connecter à l'API

```lua
local HttpService = game:GetService("HttpService")
local API_URL = "https://votre-app.onrender.com"

-- Fonction pour rechercher dans le FPR
local function rechercherFPR(nom, prenom, dateNaissance)
    local url = API_URL .. "/api/fpr/search"
    local params = "?nom=" .. HttpService:UrlEncode(nom)
    if prenom then
        params = params .. "&prenom=" .. HttpService:UrlEncode(prenom)
    end
    if dateNaissance then
        params = params .. "&dateNaissance=" .. dateNaissance
    end
    
    local success, result = pcall(function()
        return HttpService:GetAsync(url .. params)
    end)
    
    if success then
        local data = HttpService:JSONDecode(result)
        return data
    else
        warn("Erreur lors de la recherche FPR:", result)
        return nil
    end
end

-- Fonction pour rechercher un véhicule (SIV)
local function rechercherVehicule(plaque)
    local url = API_URL .. "/api/siv/search?plaqueImmatriculation=" .. HttpService:UrlEncode(plaque)
    
    local success, result = pcall(function()
        return HttpService:GetAsync(url)
    end)
    
    if success then
        local data = HttpService:JSONDecode(result)
        return data
    else
        warn("Erreur lors de la recherche SIV:", result)
        return nil
    end
end

-- Fonction pour vérifier l'assurance (FVA)
local function verifierAssurance(plaque)
    local url = API_URL .. "/api/fva/search?plaqueImmatriculation=" .. HttpService:UrlEncode(plaque)
    
    local success, result = pcall(function()
        return HttpService:GetAsync(url)
    end)
    
    if success then
        local data = HttpService:JSONDecode(result)
        return data
    else
        warn("Erreur lors de la vérification FVA:", result)
        return nil
    end
end

-- Exemple d'utilisation
local resultats = rechercherFPR("Dupont", "Jean", "1990-01-15")
if resultats and resultats.success then
    for _, personne in ipairs(resultats.resultats) do
        print("Personne recherchée:", personne.nom, personne.prenom)
        if personne.dangereux then
            print("⚠️ ATTENTION: Personne dangereuse!")
        end
    end
end
```

## 🔧 Configuration Roblox

1. Dans Roblox Studio, aller dans Game Settings
2. Security → HTTP Requests → Activer "Allow HTTP Requests"
3. Remplacer `API_URL` par l'URL de votre application Render

## 📡 Endpoints API

### FPR
- `GET /api/fpr/search?nom=X&prenom=Y&dateNaissance=Z`
- `POST /api/fpr/add` (body JSON)

### SNPC
- `GET /api/snpc/search?nom=X&prenom=Y&dateNaissance=Z`
- `POST /api/snpc/add` (body JSON)

### SIV
- `GET /api/siv/search?marque=X&modele=Y&plaqueImmatriculation=Z`
- `POST /api/siv/add` (body JSON)

### TAJ
- `GET /api/taj/search?nom=X&prenom=Y&dateNaissance=Z`
- `POST /api/taj/add` (body JSON)

### FVA
- `GET /api/fva/search?plaqueImmatriculation=X`

### FOVeS
- `GET /api/foves/search?type=X&marque=Y&modele=Z&plaqueImmatriculation=W`
- `POST /api/foves/add` (body JSON)

## 💻 Installation locale (développement)

```bash
npm install
npm start
```

Le serveur démarre sur http://localhost:3000

## 🛠️ Technologies utilisées

- **Backend**: Node.js + Express
- **Base de données**: MongoDB
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Hébergement**: Render
- **Intégration**: Roblox HttpService

## 📝 Notes importantes

- L'application utilise MongoDB Atlas (gratuit jusqu'à 512 MB)
- Render offre 750h gratuites par mois
- L'application se met en veille après 15 minutes d'inactivité (plan gratuit)
- Le premier appel après inactivité peut prendre 30-60 secondes

## 🔒 Sécurité

Pour la production, il est recommandé d'ajouter:
- Authentification par token
- Rate limiting
- Validation des entrées
- HTTPS uniquement
- Logs d'accès

## 📞 Support

Pour toute question, créez une issue sur le repository.
