# Etapa 1: Build y Dependencias
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Etapa 2: Imagen Final Ejecutable
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Crear usuario sin privilegios para seguridad (DevSecOps)
RUN addgroup -S devopsgroup && adduser -S devopsuser -G devopsgroup

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=devopsuser:devopsgroup . .

USER devopsuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]