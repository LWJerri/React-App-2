FROM node:18-slim AS build

WORKDIR /app

COPY .npmrc ./apps/frontend ./

RUN corepack enable

RUN pnpm i

ARG VITE_API_URL

RUN VITE_API_URL=${VITE_API_URL} pnpm build

FROM devforth/spa-to-http:latest

COPY --from=build /app/dist .