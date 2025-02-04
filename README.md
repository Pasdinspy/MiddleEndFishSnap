# PythonMiddleware
```
cd existing_repo
git remote add origin https://gitlab.norgayitservices.com/norgay-brest/poc/pythonmiddleware.git
git branch -M main
git push -uf origin main
```



Installation

Cloner le dépôt

  git clone https://gitlab.norgayitservices.com/norgay-brest/poc/pythonmiddleware.git
  cd pythonmiddleware

Installer les dépendances

  npm install

Lancer le serveur en mode développement (avec rechargement automatique)

  npm run dev

Lancer le serveur en mode production

  npm start

Dépendances utilisées

Le projet utilise les bibliothèques suivantes :

{
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.1.1",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "form-data": "^4.0.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.9.6",
    "multer": "^1.4.5-lts.1",
    "node-fetch": "^2.7.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}


BDD :

mongosh

test> use fishsnap