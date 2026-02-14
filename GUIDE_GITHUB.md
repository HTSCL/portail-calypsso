# 📘 Guide Complet - Mettre Calypsso sur GitHub

## 🎯 Méthode 1 : Via l'interface GitHub (PLUS FACILE)

### Étape 1 : Créer un compte GitHub
1. Va sur https://github.com
2. Clique sur "Sign up" (Inscription)
3. Suis les étapes pour créer ton compte

### Étape 2 : Créer un nouveau repository
1. Une fois connecté, clique sur le bouton **"+"** en haut à droite
2. Sélectionne **"New repository"**
3. Remplis les informations :
   - **Repository name** : `portail-calypsso`
   - **Description** : "Portail Calypsso - Système de fichiers policiers pour Roblox"
   - Choisis **Public** ou **Private**
   - ✅ Coche **"Add a README file"**
   - Choisis **"Node"** pour le .gitignore
   - Clique sur **"Create repository"**

### Étape 3 : Uploader les fichiers
1. Dans ton nouveau repository, clique sur **"Add file"** → **"Upload files"**
2. Glisse-dépose TOUS les fichiers que je t'ai créés :
   - `server.js`
   - `package.json`
   - `.env.example`
   - `.gitignore`
   - `README.md`
   - `RobloxIntegration.lua`
   - Le dossier `public/` avec tous ses fichiers
3. En bas, écris un message : "Initial commit - Portail Calypsso"
4. Clique sur **"Commit changes"**

✅ **C'EST FAIT !** Ton code est sur GitHub !

---

## 🎯 Méthode 2 : Via Git (POUR LES PROS)

### Étape 1 : Installer Git
**Windows :**
- Télécharge Git : https://git-scm.com/download/win
- Lance l'installateur et clique "Next" partout

**Mac :**
```bash
brew install git
```

**Linux :**
```bash
sudo apt-get install git
```

### Étape 2 : Configurer Git (première fois seulement)
Ouvre un terminal/invite de commande et tape :
```bash
git config --global user.name "Ton Nom"
git config --global user.email "ton@email.com"
```

### Étape 3 : Créer le repository sur GitHub
1. Va sur https://github.com
2. Clique sur **"+"** → **"New repository"**
3. Nom : `portail-calypsso`
4. **NE COCHE RIEN** (pas de README, pas de .gitignore)
5. Clique sur **"Create repository"**
6. **GARDE LA PAGE OUVERTE** (tu auras besoin des commandes affichées)

### Étape 4 : Uploader depuis ton ordinateur

**Option A : Si tu as téléchargé mes fichiers**

1. Ouvre un terminal/invite de commande
2. Va dans le dossier où tu as téléchargé les fichiers :
```bash
cd /chemin/vers/le/dossier
```

3. Initialise Git :
```bash
git init
```

4. Ajoute tous les fichiers :
```bash
git add .
```

5. Crée ton premier commit :
```bash
git commit -m "Initial commit - Portail Calypsso"
```

6. Connecte ton dossier à GitHub (remplace TON_USERNAME) :
```bash
git remote add origin https://github.com/TON_USERNAME/portail-calypsso.git
```

7. Envoie tout sur GitHub :
```bash
git branch -M main
git push -u origin main
```

**Option B : Si tu veux cloner directement**

1. Après avoir créé le repository sur GitHub, copie l'URL
2. Dans le terminal :
```bash
git clone https://github.com/TON_USERNAME/portail-calypsso.git
cd portail-calypsso
```

3. Copie tous mes fichiers dans ce dossier

4. Ajoute et envoie :
```bash
git add .
git commit -m "Initial commit - Portail Calypsso"
git push
```

---

## 🔐 Important : Le fichier .env

**⚠️ ATTENTION :** Ne JAMAIS mettre le fichier `.env` sur GitHub !

C'est pour ça que j'ai créé `.env.example` à la place.

Quand tu auras ta vraie connexion MongoDB :
1. Crée un fichier `.env` (sans "example")
2. Mets-y ta vraie connexion MongoDB
3. **NE LE COMMIT JAMAIS** (il est dans .gitignore)

---

## 🚀 Déployer sur Render depuis GitHub

### Étape 1 : Créer MongoDB Atlas
1. Va sur https://www.mongodb.com/cloud/atlas
2. Clique "Try Free"
3. Crée un compte
4. Choisis "M0 Sandbox" (GRATUIT)
5. Choisis une région proche (Europe - Paris par exemple)
6. Clique "Create Cluster"
7. Attends 3-5 minutes

### Étape 2 : Configurer MongoDB
1. Dans Atlas, clique sur "Database Access"
2. Clique "Add New Database User"
   - Username : `calypsso`
   - Password : génère un mot de passe fort (COPIE-LE !)
   - User Privileges : "Read and write to any database"
   - Clique "Add User"

3. Clique sur "Network Access"
4. Clique "Add IP Address"
5. Clique "Allow Access from Anywhere" (0.0.0.0/0)
6. Clique "Confirm"

### Étape 3 : Récupérer la connexion MongoDB
1. Retourne sur "Database"
2. Clique "Connect" sur ton cluster
3. Choisis "Connect your application"
4. Copie la chaîne de connexion, elle ressemble à :
```
mongodb+srv://calypsso:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
5. Remplace `<password>` par ton vrai mot de passe
6. **GARDE CETTE CHAÎNE**, tu en auras besoin !

### Étape 4 : Déployer sur Render
1. Va sur https://render.com
2. Clique "Get Started" et crée un compte (utilise GitHub pour te connecter)
3. Clique "New +" → "Web Service"
4. Clique "Connect GitHub"
5. Autorise Render à accéder à tes repos
6. Sélectionne `portail-calypsso`
7. Configuration :
   - **Name** : `calypsso-portail`
   - **Region** : Frankfurt (ou proche de toi)
   - **Branch** : `main`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free

### Étape 5 : Ajouter les variables d'environnement
1. Descends jusqu'à "Environment Variables"
2. Clique "Add Environment Variable"
3. Ajoute :
   - **Key** : `MONGODB_URI`
   - **Value** : [Colle ta chaîne de connexion MongoDB complète]
4. Clique "Add"

### Étape 6 : Déployer !
1. Clique "Create Web Service"
2. Attends 2-3 minutes
3. Tu verras des logs défiler
4. Quand tu vois "✅ Connecté à MongoDB" → C'EST BON !

### Étape 7 : Récupérer l'URL
1. En haut de la page, tu verras l'URL de ton app
2. Elle ressemble à : `https://calypsso-portail.onrender.com`
3. **COPIE CETTE URL** pour l'utiliser dans Roblox !

---

## 🎮 Utiliser dans Roblox

### Étape 1 : Activer HTTP dans Roblox Studio
1. Ouvre Roblox Studio
2. Va dans "Home" → "Game Settings" (icône d'engrenage)
3. Onglet "Security"
4. Active **"Allow HTTP Requests"**
5. Clique "Save"

### Étape 2 : Ajouter le script
1. Dans Roblox Studio, crée un "ModuleScript" dans ServerScriptService
2. Nomme-le "CalypssoAPI"
3. Copie le contenu de `RobloxIntegration.lua`
4. Remplace `https://votre-app.onrender.com` par TON URL Render

### Étape 3 : Utiliser l'API
Crée un Script dans ServerScriptService :

```lua
local CalypssoAPI = require(game.ServerScriptService.CalypssoAPI)

-- Exemple : Rechercher une personne
local resultats = CalypssoAPI.rechercherPersonne("Dupont", "Jean")
if resultats and resultats.success then
    print("Personnes trouvées:", #resultats.resultats)
end

-- Exemple : Vérifier un véhicule
local vehicule = CalypssoAPI.rechercherVehicule(nil, nil, "AB-123-CD")
CalypssoAPI.afficherResultats(vehicule, "CONTRÔLE VÉHICULE")
```

---

## 🔄 Mettre à jour ton code

Quand tu modifies des fichiers :

```bash
git add .
git commit -m "Description de tes modifications"
git push
```

Render redéploiera automatiquement !

---

## 🐛 Résolution de problèmes

### "Git n'est pas reconnu"
→ Réinstalle Git et redémarre ton terminal

### "Permission denied"
→ Tu n'as pas accès au repository. Vérifie que c'est bien le tien

### "Failed to connect to MongoDB"
→ Vérifie que :
- Ta chaîne de connexion est correcte
- Tu as bien remplacé `<password>`
- L'IP 0.0.0.0/0 est autorisée dans MongoDB Atlas

### "Render service won't start"
→ Regarde les logs dans Render. Souvent c'est la variable MONGODB_URI qui manque

### "Roblox can't connect to API"
→ Vérifie que :
- HTTP Requests est activé dans Game Settings
- L'URL Render est correcte
- Ton app Render est bien démarrée (elle dort après 15min d'inactivité)

---

## ✅ Checklist finale

- [ ] Compte GitHub créé
- [ ] Repository créé sur GitHub
- [ ] Tous les fichiers uploadés
- [ ] Compte MongoDB Atlas créé
- [ ] Base de données créée
- [ ] Utilisateur MongoDB créé
- [ ] IP autorisée (0.0.0.0/0)
- [ ] Compte Render créé
- [ ] Service Render créé
- [ ] Variable MONGODB_URI ajoutée
- [ ] Service déployé avec succès
- [ ] URL copiée
- [ ] HTTP activé dans Roblox
- [ ] Script Lua ajouté et configuré
- [ ] Premiers tests effectués

---

## 🎉 Félicitations !

Ton Portail Calypsso est maintenant :
- ✅ Sur GitHub (versioning)
- ✅ Hébergé sur Render (accessible 24/7)
- ✅ Connecté à MongoDB (base de données)
- ✅ Utilisable dans Roblox (API)

**Profite bien de ton système !** 🚔🛡️
