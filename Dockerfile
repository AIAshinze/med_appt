FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS production

WORKDIR /app
RUN npm install --global serve

COPY --from=build /app/server/build ./build

EXPOSE 3000

CMD ["serve", "--single", "--listen", "3000", "build"]
