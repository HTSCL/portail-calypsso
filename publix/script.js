// Configuration de l'API
const API_URL = window.location.origin;

// Gestion de la navigation entre fichiers
document.querySelectorAll('.fichier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const fichier = btn.dataset.fichier;
        
        // Mise à jour des boutons
        document.querySelectorAll('.fichier-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Mise à jour des sections
        document.querySelectorAll('.fichier-section').forEach(s => s.classList.remove('active'));
        document.getElementById(fichier).classList.add('active');
    });
});

// Fonction de recherche FPR
async function searchFPR() {
    const nom = document.getElementById('fpr-nom').value;
    const prenom = document.getElementById('fpr-prenom').value;
    const dateNaissance = document.getElementById('fpr-date').value;
    
    const resultsDiv = document.getElementById('fpr-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams();
        if (nom) params.append('nom', nom);
        if (prenom) params.append('prenom', prenom);
        if (dateNaissance) params.append('dateNaissance', dateNaissance);
        
        const response = await fetch(`${API_URL}/api/fpr/search?${params}`);
        const data = await response.json();
        
        if (data.success && data.resultats.length > 0) {
            let html = '';
            data.resultats.forEach(personne => {
                const dangerClass = personne.dangereux ? 'alert-danger' : '';
                html += `
                    <div class="result-card ${dangerClass}">
                        <h3>👤 ${personne.nom} ${personne.prenom}</h3>
                        ${personne.dangereux ? '<span class="badge badge-danger">⚠️ DANGEREUX</span>' : ''}
                        <p><span class="label">Date de naissance :</span> ${new Date(personne.dateNaissance).toLocaleDateString('fr-FR')}</p>
                        <p><span class="label">Motif :</span> ${personne.motifRecherche}</p>
                        <p><span class="label">Description :</span> ${personne.description || 'N/A'}</p>
                        <p><span class="label">Signalé le :</span> ${new Date(personne.dateAjout).toLocaleDateString('fr-FR')}</p>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Aucun résultat trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction de recherche SNPC
async function searchSNPC() {
    const nom = document.getElementById('snpc-nom').value;
    const prenom = document.getElementById('snpc-prenom').value;
    const dateNaissance = document.getElementById('snpc-date').value;
    
    const resultsDiv = document.getElementById('snpc-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams();
        if (nom) params.append('nom', nom);
        if (prenom) params.append('prenom', prenom);
        if (dateNaissance) params.append('dateNaissance', dateNaissance);
        
        const response = await fetch(`${API_URL}/api/snpc/search?${params}`);
        const data = await response.json();
        
        if (data.success && data.resultats.length > 0) {
            let html = '';
            data.resultats.forEach(permis => {
                const validClass = permis.validite ? 'alert-success' : 'alert-danger';
                html += `
                    <div class="result-card ${validClass}">
                        <h3>🚗 ${permis.nom} ${permis.prenom}</h3>
                        ${permis.validite ? '<span class="badge badge-success">✅ VALIDE</span>' : '<span class="badge badge-danger">❌ NON VALIDE</span>'}
                        <p><span class="label">Date de naissance :</span> ${new Date(permis.dateNaissance).toLocaleDateString('fr-FR')}</p>
                        <p><span class="label">N° Permis :</span> ${permis.numeroPermis}</p>
                        <p><span class="label">Catégories :</span> ${permis.categoriesPermis.join(', ')}</p>
                        <p><span class="label">Date d'obtention :</span> ${new Date(permis.dateObtention).toLocaleDateString('fr-FR')}</p>
                        <p><span class="label">Points :</span> ${permis.points}/12</p>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Aucun permis trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction de recherche SIV
async function searchSIV() {
    const marque = document.getElementById('siv-marque').value;
    const modele = document.getElementById('siv-modele').value;
    const plaque = document.getElementById('siv-plaque').value;
    
    const resultsDiv = document.getElementById('siv-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams();
        if (marque) params.append('marque', marque);
        if (modele) params.append('modele', modele);
        if (plaque) params.append('plaqueImmatriculation', plaque);
        
        const response = await fetch(`${API_URL}/api/siv/search?${params}`);
        const data = await response.json();
        
        if (data.success && data.resultats.length > 0) {
            let html = '';
            data.resultats.forEach(vehicule => {
                const voleClass = vehicule.vole ? 'alert-danger' : '';
                html += `
                    <div class="result-card ${voleClass}">
                        <h3>🚙 ${vehicule.marque} ${vehicule.modele}</h3>
                        ${vehicule.vole ? '<span class="badge badge-danger">🚨 VOLÉ</span>' : ''}
                        ${vehicule.assure ? '<span class="badge badge-success">✅ ASSURÉ</span>' : '<span class="badge badge-warning">⚠️ NON ASSURÉ</span>'}
                        <p><span class="label">Plaque :</span> ${vehicule.plaqueImmatriculation}</p>
                        <p><span class="label">Couleur :</span> ${vehicule.couleur}</p>
                        <p><span class="label">Année :</span> ${vehicule.annee}</p>
                        <p><span class="label">Propriétaire :</span> ${vehicule.proprietaire}</p>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Aucun véhicule trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction de recherche TAJ
async function searchTAJ() {
    const nom = document.getElementById('taj-nom').value;
    const prenom = document.getElementById('taj-prenom').value;
    const dateNaissance = document.getElementById('taj-date').value;
    
    const resultsDiv = document.getElementById('taj-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams();
        if (nom) params.append('nom', nom);
        if (prenom) params.append('prenom', prenom);
        if (dateNaissance) params.append('dateNaissance', dateNaissance);
        
        const response = await fetch(`${API_URL}/api/taj/search?${params}`);
        const data = await response.json();
        
        if (data.success && data.resultats.length > 0) {
            let html = '';
            data.resultats.forEach(taj => {
                html += `
                    <div class="result-card alert-warning">
                        <h3>⚖️ ${taj.nom} ${taj.prenom}</h3>
                        <span class="badge badge-warning">${taj.antecedents.length} antécédent(s)</span>
                        <p><span class="label">Date de naissance :</span> ${new Date(taj.dateNaissance).toLocaleDateString('fr-FR')}</p>
                        ${taj.photographie ? `<p><span class="label">Photo :</span> ${taj.photographie}</p>` : ''}
                        <div style="margin-top: 15px;">
                            <strong>Antécédents :</strong>
                            ${taj.antecedents.map(ant => `
                                <div style="margin-left: 20px; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 5px;">
                                    <p><span class="label">Date :</span> ${new Date(ant.date).toLocaleDateString('fr-FR')}</p>
                                    <p><span class="label">Infraction :</span> ${ant.infraction}</p>
                                    <p><span class="label">Lieu :</span> ${ant.lieu}</p>
                                    <p><span class="label">Service :</span> ${ant.service}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Aucun antécédent trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction de recherche FVA
async function searchFVA() {
    const plaque = document.getElementById('fva-plaque').value;
    
    const resultsDiv = document.getElementById('fva-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams({ plaqueImmatriculation: plaque });
        const response = await fetch(`${API_URL}/api/fva/search?${params}`);
        const data = await response.json();
        
        if (data.success) {
            const assureClass = data.assure ? 'alert-success' : 'alert-danger';
            const html = `
                <div class="result-card ${assureClass}">
                    <h3>📄 ${data.vehicule.marque} ${data.vehicule.modele}</h3>
                    ${data.assure ? '<span class="badge badge-success">✅ ASSURÉ</span>' : '<span class="badge badge-danger">❌ NON ASSURÉ</span>'}
                    <p><span class="label">Plaque :</span> ${data.vehicule.plaqueImmatriculation}</p>
                    ${data.dateAssurance ? `<p><span class="label">Date d'assurance :</span> ${new Date(data.dateAssurance).toLocaleDateString('fr-FR')}</p>` : ''}
                    <p><span class="label">Propriétaire :</span> ${data.vehicule.proprietaire}</p>
                </div>
            `;
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Véhicule non trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction de recherche FOVeS
async function searchFOVeS() {
    const type = document.getElementById('foves-type').value;
    const marque = document.getElementById('foves-marque').value;
    const modele = document.getElementById('foves-modele').value;
    const plaque = document.getElementById('foves-plaque').value;
    
    const resultsDiv = document.getElementById('foves-results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Recherche en cours...</div>';
    
    try {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        if (marque) params.append('marque', marque);
        if (modele) params.append('modele', modele);
        if (plaque) params.append('plaqueImmatriculation', plaque);
        
        const response = await fetch(`${API_URL}/api/foves/search?${params}`);
        const data = await response.json();
        
        if (data.success && data.resultats.length > 0) {
            let html = '';
            data.resultats.forEach(objet => {
                const statutClass = objet.statut === 'volé' ? 'alert-danger' : 'alert-warning';
                html += `
                    <div class="result-card ${statutClass}">
                        <h3>🚨 ${objet.type.toUpperCase()}</h3>
                        <span class="badge ${objet.statut === 'volé' ? 'badge-danger' : 'badge-warning'}">${objet.statut.toUpperCase()}</span>
                        <p><span class="label">Description :</span> ${objet.description}</p>
                        ${objet.marque ? `<p><span class="label">Marque :</span> ${objet.marque}</p>` : ''}
                        ${objet.modele ? `<p><span class="label">Modèle :</span> ${objet.modele}</p>` : ''}
                        ${objet.plaqueImmatriculation ? `<p><span class="label">Plaque :</span> ${objet.plaqueImmatriculation}</p>` : ''}
                        <p><span class="label">Signalé le :</span> ${new Date(objet.dateSignalement).toLocaleDateString('fr-FR')}</p>
                        <p><span class="label">Signalé par :</span> ${objet.signalePar}</p>
                    </div>
                `;
            });
            resultsDiv.innerHTML = html;
        } else {
            resultsDiv.innerHTML = '<div class="no-results">❌ Aucun objet signalé trouvé</div>';
        }
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert-danger">⚠️ Erreur : ${error.message}</div>`;
    }
}

// Fonction pour afficher le formulaire d'ajout
function showAddForm(fichier) {
    const modal = document.getElementById('addModal');
    const formContainer = document.getElementById('addFormContainer');
    
    let formHTML = '';
    
    switch(fichier) {
        case 'fpr':
            formHTML = `
                <form onsubmit="addFPR(event)">
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" name="nom" required>
                    </div>
                    <div class="form-group">
                        <label>Prénom</label>
                        <input type="text" name="prenom" required>
                    </div>
                    <div class="form-group">
                        <label>Date de naissance</label>
                        <input type="date" name="dateNaissance" required>
                    </div>
                    <div class="form-group">
                        <label>Motif de recherche</label>
                        <input type="text" name="motifRecherche" required>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea name="description"></textarea>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" name="dangereux"> Personne dangereuse
                        </label>
                    </div>
                    <button type="submit" class="btn-submit">Ajouter</button>
                </form>
            `;
            break;
        // Ajouter d'autres formulaires selon les besoins
    }
    
    formContainer.innerHTML = formHTML;
    modal.style.display = 'block';
}

// Fonction pour fermer le modal
function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Fonction pour ajouter une entrée FPR
async function addFPR(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        dateNaissance: formData.get('dateNaissance'),
        motifRecherche: formData.get('motifRecherche'),
        description: formData.get('description'),
        dangereux: formData.get('dangereux') === 'on'
    };
    
    try {
        const response = await fetch(`${API_URL}/api/fpr/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Personne ajoutée avec succès');
            closeAddModal();
            searchFPR();
        } else {
            alert('❌ Erreur : ' + result.error);
        }
    } catch (error) {
        alert('❌ Erreur : ' + error.message);
    }
}

// Fermer le modal en cliquant en dehors
window.onclick = function(event) {
    const modal = document.getElementById('addModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
