# Stage 1: build the React application
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve the built assets with nginx
FROM nginx:1.27-alpine AS runner
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
