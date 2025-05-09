FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Démarrer l'application
CMD ["node", "main.js"]
