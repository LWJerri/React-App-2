FROM node:18-slim

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY .npmrc apps/backend ./

RUN npm i pnpm@latest -g
RUN pnpm i

RUN pnpm build

CMD ["pnpm", "start"]