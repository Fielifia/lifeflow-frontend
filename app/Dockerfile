# --- Base ---
FROM node:lts-bookworm-slim AS base
WORKDIR /usr/src/app
COPY package*.json ./

# --- Development ---
FROM base AS development
RUN npm install
COPY . .
CMD ["npm", "start"]

# --- Build ---
FROM base AS build
RUN npm install
COPY . .
RUN npm run build

# --- Production ---
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
