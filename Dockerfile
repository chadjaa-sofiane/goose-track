FROM oven/bun:1.2.4 AS build

WORKDIR /app

COPY package.json package-lock.json bun.lock turbo.json ./
COPY packages/api/package.json packages/api/package.json
COPY packages/client/package.json packages/client/package.json

# Install full workspace dependencies needed to build the client.
RUN bun install

COPY . .

RUN bun run --cwd packages/client build

FROM oven/bun:1.2.4

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app /app

EXPOSE 3000

# Ensure JWT key files exist, then seed demo user and start API.
CMD ["sh", "-lc", "bun --cwd packages/api scripts/generateKeys.js && bun run --cwd packages/api seed:dummy-user && bun run --cwd packages/api start"]
