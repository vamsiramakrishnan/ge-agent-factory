# GE Agent Factory presentation UI image.
# Serves apps/presentation/dist via the Bun server (apps/presentation/server.js).
# It intentionally does not mount factory execution routes; real work belongs to
# the console/API gateway/CLI/MCP surfaces. Build context is the repo root:
#   docker build -f apps/presentation/Dockerfile -t <img> .

# ── build stage ───────────────────────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

# Workspace manifests first for layer caching.
COPY package.json bun.lock ./
# Shared @ge/* workspace packages (the deck imports @ge/ui, @ge/contracts, …) —
# raw TS consumed at build time, so they must be present for `bun install` to
# resolve the workspace.
COPY packages ./packages
COPY apps/console/package.json apps/console/
COPY apps/presentation/package.json apps/presentation/
COPY apps/factory/package.json apps/factory/
RUN bun install --frozen-lockfile --ignore-scripts

# Build the presentation SPA.
COPY apps/presentation ./apps/presentation
RUN bun run --cwd apps/presentation build

# Generate the use-case catalog build artifact (relocated out of the source tree).
# Needs the presentation slides (above) + the generator source.
COPY apps/factory ./apps/factory
RUN cd apps/factory && bun scripts/sync-use-cases-from-slides.mjs

# ── production stage ──────────────────────────────────────────────────────────
FROM oven/bun:1.3-alpine
WORKDIR /app

COPY package.json bun.lock ./
# Shared @ge/* workspace packages (the deck imports @ge/ui, @ge/contracts, …) —
# raw TS consumed at build time, so they must be present for `bun install` to
# resolve the workspace.
COPY packages ./packages
COPY apps/console/package.json apps/console/
COPY apps/presentation/package.json apps/presentation/
COPY apps/factory/package.json apps/factory/
RUN bun install --frozen-lockfile --production --ignore-scripts

# Built SPA + the server and the modules it imports at runtime.
COPY --from=builder /app/apps/presentation/dist ./apps/presentation/dist
COPY apps/presentation/server.js ./apps/presentation/
COPY apps/presentation/src/server ./apps/presentation/src/server

WORKDIR /app/apps/presentation
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["bun", "server.js"]
