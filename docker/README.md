# Docker setup

This folder contains the local Docker stack for Goose Track:
- `mongo` (MongoDB)
- `api` (Bun backend)
- `client` (Vite frontend)

## Run

From project root:

```bash
docker compose -f docker/docker-compose.yml up --build
```

## Stop

```bash
docker compose -f docker/docker-compose.yml down
```

## Remove DB volume too

```bash
docker compose -f docker/docker-compose.yml down -v
```
