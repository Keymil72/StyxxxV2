FROM node:20.7.0
COPY package.json ./
RUN npm install 
COPY . .
CMD ["node", "src/index.js"]
