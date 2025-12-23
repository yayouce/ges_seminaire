FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# copy everything first so local file: dependencies resolve
COPY . .

# install all deps (including dev) and build
RUN npm install && npm run build

FROM node:18-alpine AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

# copy production artifacts from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3005

CMD ["node", "dist/src/main.js"]
