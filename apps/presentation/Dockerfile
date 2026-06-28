# GE Agent Factory — Presentation / gateway image.
# Serves apps/presentation/dist via the Bun server (apps/presentation/server.js),
# which also mounts the factory bridge (/api/factory). Built + pushed as
# ge-agent-factory-gateway and bound to the gateway Cloud Run service
# (installer/terraform/cloud_run.tf) via -var gateway_image=...  Build context is
# the repo root (so the generator + workspace manifests resolve):
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

# Build the presentation SPA. tools/ is needed because the deck's server bridge
# (bundled via vite.config) imports tools/lib/*.
COPY apps/presentation ./apps/presentation
COPY tools ./tools
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
# Whole src/server dir (factory-bridge, iap-jwt, firebase-auth, …) so new server
# modules don't need a Dockerfile edit; tools/ provides the libs they import.
COPY apps/presentation/src/server ./apps/presentation/src/server
COPY tools ./tools

# Generator files needed for container-side scaffolding + the generated catalog.
COPY apps/factory/scripts ./apps/factory/scripts
COPY apps/factory/src ./apps/factory/src
COPY --from=builder /app/apps/factory/generated ./apps/factory/generated

WORKDIR /app/apps/presentation
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["bun", "server.js"]
