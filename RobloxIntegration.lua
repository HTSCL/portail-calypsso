--[[
    Script d'intégration Calypsso pour Roblox
    Ce script permet de connecter votre jeu Roblox au Portail Calypsso
]]

local HttpService = game:GetService("HttpService")
local Players = game:GetService("Players")

-- Configuration
local CONFIG = {
    API_URL = "https://votre-app.onrender.com", -- Remplacer par l'URL de votre app Render
    DEBUG_MODE = true
}

-- Module Calypsso
local Calypsso = {}

-- Fonction utilitaire pour les requêtes GET
local function makeGetRequest(endpoint, params)
    local url = CONFIG.API_URL .. endpoint
    
    if params then
        local queryString = "?"
        for key, value in pairs(params) do
            queryString = queryString .. HttpService:UrlEncode(key) .. "=" .. HttpService:UrlEncode(tostring(value)) .. "&"
        end
        url = url .. queryString:sub(1, -2)
    end
    
    if CONFIG.DEBUG_MODE then
        print("[Calypsso] GET:", url)
    end
    
    local success, result = pcall(function()
        return HttpService:GetAsync(url)
    end)
    
    if success then
        return HttpService:JSONDecode(result)
    else
        warn("[Calypsso] Erreur GET:", result)
        return nil
    end
end

-- Fonction utilitaire pour les requêtes POST
local function makePostRequest(endpoint, data)
    local url = CONFIG.API_URL .. endpoint
    
    if CONFIG.DEBUG_MODE then
        print("[Calypsso] POST:", url)
    end
    
    local success, result = pcall(function()
        return HttpService:PostAsync(url, HttpService:JSONEncode(data), Enum.HttpContentType.ApplicationJson)
    end)
    
    if success then
        return HttpService:JSONDecode(result)
    else
        warn("[Calypsso] Erreur POST:", result)
        return nil
    end
end

-- FPR: Rechercher une personne
function Calypsso.rechercherPersonne(nom, prenom, dateNaissance)
    local params = {}
    if nom then params.nom = nom end
    if prenom then params.prenom = prenom end
    if dateNaissance then params.dateNaissance = dateNaissance end
    
    return makeGetRequest("/api/fpr/search", params)
end

-- FPR: Ajouter une personne recherchée
function Calypsso.ajouterPersonneRecherchee(data)
    return makePostRequest("/api/fpr/add", data)
end

-- SNPC: Vérifier le permis de conduire
function Calypsso.verifierPermis(nom, prenom, dateNaissance)
    local params = {}
    if nom then params.nom = nom end
    if prenom then params.prenom = prenom end
    if dateNaissance then params.dateNaissance = dateNaissance end
    
    return makeGetRequest("/api/snpc/search", params)
end

-- SIV: Rechercher un véhicule
function Calypsso.rechercherVehicule(marque, modele, plaque)
    local params = {}
    if marque then params.marque = marque end
    if modele then params.modele = modele end
    if plaque then params.plaqueImmatriculation = plaque end
    
    return makeGetRequest("/api/siv/search", params)
end

-- FVA: Vérifier l'assurance d'un véhicule
function Calypsso.verifierAssurance(plaque)
    return makeGetRequest("/api/fva/search", {plaqueImmatriculation = plaque})
end

-- TAJ: Consulter les antécédents judiciaires
function Calypsso.consulterTAJ(nom, prenom, dateNaissance)
    local params = {}
    if nom then params.nom = nom end
    if prenom then params.prenom = prenom end
    if dateNaissance then params.dateNaissance = dateNaissance end
    
    return makeGetRequest("/api/taj/search", params)
end

-- FOVeS: Rechercher un objet ou véhicule signalé
function Calypsso.rechercherObjetSignale(typeObjet, marque, modele, plaque)
    local params = {}
    if typeObjet then params.type = typeObjet end
    if marque then params.marque = marque end
    if modele then params.modele = modele end
    if plaque then params.plaqueImmatriculation = plaque end
    
    return makeGetRequest("/api/foves/search", params)
end

-- Fonction d'aide pour afficher les résultats
function Calypsso.afficherResultats(data, titre)
    if not data then
        print("[Calypsso] Aucune donnée reçue")
        return
    end
    
    print("========================================")
    print(titre or "RÉSULTATS CALYPSSO")
    print("========================================")
    
    if data.success then
        if data.resultats then
            print("Nombre de résultats:", #data.resultats)
            for i, resultat in ipairs(data.resultats) do
                print("\n--- Résultat", i, "---")
                for key, value in pairs(resultat) do
                    if type(value) ~= "table" then
                        print(key .. ":", value)
                    end
                end
            end
        else
            print("Résultat unique:")
            for key, value in pairs(data) do
                if type(value) ~= "table" and key ~= "success" then
                    print(key .. ":", value)
                end
            end
        end
    else
        print("⚠️ Recherche échouée:", data.message or "Erreur inconnue")
    end
    
    print("========================================\n")
end

-- Exemples d'utilisation commentés
--[[

-- Exemple 1: Rechercher une personne
local resultats = Calypsso.rechercherPersonne("Dupont", "Jean", "1990-01-15")
Calypsso.afficherResultats(resultats, "RECHERCHE PERSONNE")

-- Exemple 2: Vérifier un permis de conduire
local permis = Calypsso.verifierPermis("Martin", "Sophie", "1985-05-20")
if permis and permis.success and #permis.resultats > 0 then
    local p = permis.resultats[1]
    if p.validite then
        print("✅ Permis valide -", p.points, "points")
    else
        print("❌ Permis non valide")
    end
end

-- Exemple 3: Contrôler un véhicule
local plaque = "AB-123-CD"
local vehicule = Calypsso.rechercherVehicule(nil, nil, plaque)
local assurance = Calypsso.verifierAssurance(plaque)

if vehicule and vehicule.success and #vehicule.resultats > 0 then
    local v = vehicule.resultats[1]
    print("Véhicule:", v.marque, v.modele)
    
    if v.vole then
        print("🚨 ALERTE: VÉHICULE VOLÉ!")
    end
    
    if assurance and assurance.success then
        if assurance.assure then
            print("✅ Véhicule assuré")
        else
            print("⚠️ Véhicule NON assuré")
        end
    end
end

-- Exemple 4: Consulter les antécédents
local taj = Calypsso.consulterTAJ("Durand", "Pierre", "1980-12-10")
if taj and taj.success and #taj.resultats > 0 then
    local t = taj.resultats[1]
    print("Antécédents trouvés:", #t.antecedents)
    for i, ant in ipairs(t.antecedents) do
        print(i, "-", ant.infraction, "le", ant.date)
    end
end

-- Exemple 5: Ajouter une personne recherchée
local nouvPersonne = {
    nom = "Suspect",
    prenom = "Test",
    dateNaissance = "1995-03-20",
    motifRecherche = "Vol",
    description = "Individu recherché pour vol",
    dangereux = false
}
local ajout = Calypsso.ajouterPersonneRecherchee(nouvPersonne)
if ajout and ajout.success then
    print("✅ Personne ajoutée au FPR")
end

]]

-- Commandes pour les joueurs (exemple avec un GUI ou chat)
local function onPlayerCommand(player, command, args)
    if command == "/fpr" then
        local nom = args[1]
        local prenom = args[2]
        local resultats = Calypsso.rechercherPersonne(nom, prenom, nil)
        
        if resultats and resultats.success and #resultats.resultats > 0 then
            for _, personne in ipairs(resultats.resultats) do
                local message = string.format(
                    "👤 %s %s - %s",
                    personne.nom,
                    personne.prenom,
                    personne.motifRecherche
                )
                if personne.dangereux then
                    message = "⚠️ DANGEREUX! " .. message
                end
                -- Envoyer le message au joueur (à adapter selon votre système)
                print(message)
            end
        else
            print("Aucune personne trouvée")
        end
        
    elseif command == "/vehicule" then
        local plaque = args[1]
        local vehicule = Calypsso.rechercherVehicule(nil, nil, plaque)
        
        if vehicule and vehicule.success and #vehicule.resultats > 0 then
            local v = vehicule.resultats[1]
            local message = string.format(
                "🚗 %s %s (%s) - Propriétaire: %s",
                v.marque,
                v.modele,
                v.plaqueImmatriculation,
                v.proprietaire
            )
            if v.vole then
                message = "🚨 VOLÉ! " .. message
            end
            print(message)
        else
            print("Véhicule non trouvé")
        end
    end
end

print("[Calypsso] Module chargé et prêt!")
print("[Calypsso] URL API:", CONFIG.API_URL)

return Calypsso
