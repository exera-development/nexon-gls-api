FROM node:18.10 AS build

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY . .

RUN npm ci
RUN npm run docker:build

FROM node:18.10-alpine AS release

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
COPY --from=build /usr/src/app/build /usr/src/app/build
RUN npm ci --production

EXPOSE 4200

CMD ["node", "./build/index.js"]
