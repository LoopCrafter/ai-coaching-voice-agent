FROM node:20-alpine

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --loglevel info --legacy-peer-deps

COPY . .
RUN npm run build

ENV NODE_ENV production
EXPOSE 3000

CMD ["npm", "start"]
