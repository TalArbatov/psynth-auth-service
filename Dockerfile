FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY src/ src/
COPY tsconfig.json index.d.ts ./
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist/ dist/
COPY config/ config/
COPY drizzle/ drizzle/
COPY drizzle.config.ts ./
EXPOSE 3050
CMD ["npm", "start"]