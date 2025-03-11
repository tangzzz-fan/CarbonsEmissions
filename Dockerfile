FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps && \
    npm install -g @nestjs/cli typescript && \
    npm install --save-dev @types/cors @types/node && \
    npm cache clean --force

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"] 