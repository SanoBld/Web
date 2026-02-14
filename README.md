# SANO BLD // Interface Personnelle

**SANO BLD** est une interface web minimaliste développée par passion pour le code et le design. Ce hub regroupe des projets web créés pour le plaisir d'explorer de nouvelles technologies et affiner mes compétences en développement front-end. Inspiré par l'esthétique brute et épurée de **Nothing**, ce site combine typographie dot-matrix, animations canvas et effets interactifs.

## 🛠️ Caractéristiques Techniques

* **Design Intégralement Personnalisé** : Esthétique dot-matrix et typographies industrielles.
* **Système de Particules Interactif** : Fond dynamique géré via l'élément `<canvas>`.
* **Mode Performance** : Possibilité de désactiver les particules ET les effets 3D pour optimiser les performances.
* **Animations de Curseur Avancées** : Effet de clic avec onde de propagation.
* **Widget Spotify Intégré** : Lecteur de musique directement dans l'interface.
* **Widgets Système Multifonctions** :
  - Compteur de vues en temps réel (Firebase)
  - Batterie
  - Système d'exploitation
  - Résolution d'écran
  - Uptime de session
  - Langue du navigateur
  - État de connexion
  - CPU (nombre de cores)
  - RAM
* **Calendrier Intelligent** :
  - Affichage date/heure
  - Détection automatique des événements (Saint-Valentin, Noël, Halloween, etc.)
  - Intégration API pour événements dynamiques (jours fériés français)
* **Thèmes Dynamiques** : Gestion du mode sombre/clair via JavaScript.
* **Backend Firebase** : Intégration de Firebase Database pour le suivi en temps réel du compteur de vues.
* **Responsive Design** : Interface optimisée pour une consultation mobile et desktop avec zones tactiles améliorées.
* **Cursor Custom** : Système de suivi de curseur personnalisé pour une immersion totale (desktop uniquement).

## 🏗️ Stack Technique

* **Langages** : HTML5, CSS3, JavaScript (ES6+).
* **Services** : Firebase (App & Database), API Nager.Date pour événements.
* **Animation** : HTML5 Canvas pour le système de particules.

## 📂 Structure du Projet

* `index.html` : Structure de l'interface et points d'entrée des scripts.
* `style.css` : Architecture visuelle, animations et variables de thèmes avec optimisations mobiles.
* `script.js` : Logique métier, gestion des événements, animations et connexion Firebase.

## 🚀 Utilisation

Pour cloner et lancer ce projet localement :

1. Clonez le dépôt : `git clone https://github.com/SanoBld/Web.git`
2. Ouvrez `index.html` dans votre navigateur.
3. *Note : Pour faire fonctionner le compteur de vues, vous devez configurer vos propres clés API Firebase dans le fichier script.*


## ⚡ Fonctionnalités Interactives

- **Clic sur Date** : Bascule entre Date → Heure → Événement du jour
- **Clic sur Vues** : Cycle à travers 9 informations système différentes
- **Mode Performance** : Désactive particules + effets 3D pour fluidité maximale
- **Curseur Animé** : Effet visuel au clic avec onde de propagation

---

**Développé par Sano Bld**
