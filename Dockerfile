FROM node:22-alpine

RUN apk add --no-cache wget

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 5001

CMD ["npm", "test"]