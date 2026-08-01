FROM node:22-alpine AS deps

WORKDIR /app

COPY frontend/rockepilates-web/package*.json ./

RUN npm ci

FROM node:22-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY frontend/rockepilates-web ./

ARG NEXT_PUBLIC_BFF_URL
ARG NEXT_PUBLIC_APP_MODE
ARG NEXT_PUBLIC_ENABLE_FUTURE_ADMIN
ENV NEXT_PUBLIC_BFF_URL=$NEXT_PUBLIC_BFF_URL
ENV NEXT_PUBLIC_APP_MODE=$NEXT_PUBLIC_APP_MODE
ENV NEXT_PUBLIC_ENABLE_FUTURE_ADMIN=$NEXT_PUBLIC_ENABLE_FUTURE_ADMIN

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
