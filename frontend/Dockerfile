# Basis-Image: Node 20 (aktuelle LTS)
FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package-Dateien kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --production

# Restlichen Code kopieren
COPY . .

# Port definieren (falls du über Docker-Compose aufrufst)
EXPOSE 4000

CMD ["npm", "start"]
