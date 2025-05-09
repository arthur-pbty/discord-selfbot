FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Commande par défaut pour démarrer l'application
CMD ["node", "main.js"]