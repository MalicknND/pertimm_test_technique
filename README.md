# Test Technique Pertimm - API Concrete-datastore

Ce projet contient un script Node.js automatisé pour effectuer le test technique Pertimm en interagissant avec l'API Concrete-datastore.

## 🎯 Objectif

Ce test technique démontre les capacités à :
- Lire une documentation technique
- Suivre des consignes précises
- Écrire du code pour automatiser des interactions avec une API
- Gérer l'authentification par token
- Implémenter un système de polling pour vérifier le statut

## 🚀 Fonctionnalités

Le script automatise les 4 étapes du test technique :

1. **🔑 Inscription** - Création d'un compte utilisateur
2. **🔐 Connexion** - Authentification et récupération du token
3. **📝 Création de candidature** - Soumission d'une demande de candidature
4. **⏳ Polling** - Surveillance du statut jusqu'à completion
5. **✅ Confirmation** - Confirmation de la candidature (dans les 30 secondes)

## 🛠️ Technologies utilisées

- **Node.js** - Runtime JavaScript
- **Fetch API** - Requêtes HTTP natives
- **dotenv** - Gestion des variables d'environnement
- **Async/Await** - Gestion asynchrone

## 📋 Prérequis

- Node.js 18+ (pour l'API Fetch native)
- npm ou yarn

## 🚀 Installation et configuration

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd pertimm_test
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env` à la racine du projet :
   ```env
   BASE_URL=https://hire-game.pertimm.dev
   EMAIL=votre@email.com
   PASSWORD=votre_mot_de_passe
   FIRST_NAME=Votre_Prenom
   LAST_NAME=Votre_Nom
   ```

   **⚠️ Important :** Remplacez les valeurs par vos informations personnelles.

## 🎯 Utilisation

### Exécution du test

```bash
node pertimmScript.js
```

### Exemple de sortie

```
🚀 Début du test Pertimm automatisé
🔑 Enregistrement...
✅ Inscription réussie
🔐 Connexion...
✅ Connexion réussie, token obtenu: Token abc123...
📝 Création de la candidature...
✅ Candidature créée, URL de suivi reçue
⏳ Suivi du statut de la candidature...
Tentative 1 : Status = PENDING
Tentative 2 : Status = PENDING
Tentative 3 : Status = COMPLETED
✅ Envoi de la confirmation...
🎉 Test terminé avec succès !
```

## 📁 Structure du projet

```
pertimm_test/
├── pertimmScript.js    # Script principal automatisé
├── package.json        # Dépendances du projet
├── package-lock.json   # Verrouillage des versions
├── .env               # Variables d'environnement (à créer)
└── README.md          # Documentation
```

## 🔧 Détails techniques

### API Endpoints utilisés

- `POST /api/v1.1/auth/register/` - Inscription utilisateur
- `POST /api/v1.1/auth/login/` - Connexion et récupération du token
- `POST /api/v1.1/job-application-request/` - Création de candidature
- `GET {poll_url}` - Vérification du statut de la candidature
- `PATCH {confirmation_url}` - Confirmation de la candidature

### Gestion des erreurs

Le script inclut une gestion d'erreurs robuste :
- Vérification des codes de statut HTTP
- Validation de la présence du token
- Timeout du polling (30 tentatives maximum)
- Contrôle du délai de confirmation (30 secondes max)

### Polling automatique

- Vérification du statut toutes les secondes
- Maximum 30 tentatives (30 secondes)
- Sortie automatique quand le statut devient "COMPLETED"

## ⚠️ Contraintes importantes

1. **Délai de confirmation** : La confirmation doit être envoyée dans les **30 secondes** après le début du test
2. **Authentification** : Utilisation de l'authentification par token
3. **Polling** : Le statut doit devenir "COMPLETED" pour continuer
4. **Variables d'environnement** : Toutes les informations sensibles sont stockées dans `.env`

## 🔒 Sécurité

- Les identifiants sont stockés dans des variables d'environnement
- Le fichier `.env` ne doit pas être commité dans le repository
- Utilisation de l'authentification par token sécurisée

## 🧪 Tests et validation

Le script valide chaque étape :
- ✅ Vérification des codes de statut HTTP
- ✅ Validation de la présence du token
- ✅ Contrôle du délai de confirmation
- ✅ Gestion des erreurs avec messages détaillés

## 🚨 Gestion des erreurs

Le script gère les cas d'erreur suivants :
- Échec d'inscription/connexion
- Token manquant
- Échec de création de candidature
- Timeout du polling
- Délai de confirmation dépassé
- Erreurs de confirmation

## 📊 Métriques

Le script affiche :
- Temps d'exécution
- Nombre de tentatives de polling
- Statut de chaque étape
- Messages d'erreur détaillés

## 🔄 Réexécution

Pour relancer le test :
```bash
node pertimmScript.js
```

**Note :** Assurez-vous d'utiliser des identifiants différents si vous avez déjà un compte.

## 📝 Logs et debugging

Le script affiche des logs détaillés pour :
- Suivre la progression de chaque étape
- Identifier les points de blocage
- Valider les réponses de l'API
- Mesurer les performances

## 🤝 Support

Ce projet est un test technique pour Pertimm. Pour toute question :
- Vérifiez la configuration du fichier `.env`
- Assurez-vous que Node.js 18+ est installé
- Vérifiez la connectivité réseau vers l'API

## 📄 Licence

Ce projet est créé dans le cadre d'un test technique pour Pertimm.

---

**Développé avec ❤️ pour le test technique Pertimm**

*Script automatisé pour démontrer l'interaction avec l'API Concrete-datastore* 