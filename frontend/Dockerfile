FROM node:20-alpine AS builder

WORKDIR /app

# ARG usado pelo Vite durante o build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm install

COPY . .

# Debug opcional para confirmar URL no build
RUN echo "Building with VITE_API_URL=${VITE_API_URL}"

RUN npm run build

# --------------------
# Stage 2 — Nginx
# --------------------
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
