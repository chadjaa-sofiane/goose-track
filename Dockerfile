FROM oven/bun:1.2.4

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile
RUN bun run --cwd packages/client build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-lc", "bun run --cwd packages/api scripts/seedDummyUser.ts && bun run --cwd packages/api src/index.ts"]
