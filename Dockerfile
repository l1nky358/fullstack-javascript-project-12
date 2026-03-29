FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN ls -la

EXPOSE 5001

CMD ["node", "test-server.js"]