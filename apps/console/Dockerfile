# GE Agent Factory — Console UI image (ADR 0001).
# Serves apps/console/dist via the Bun server (apps/console/server.js), which also
# mounts the GE API (/api/ge, /api/runtime). Built + pushed as ge-agent-factory-
# console and bound to the IAP'd Cloud Run console service (installer/terraform/
# ui_services.tf) via -var console_image=...  Build context is the repo root:
#   docker build -f apps/console/Dockerfile -t <img> .

# ── build stage ───────────────────────────────────────────────────────────────
FROM oven/bun:1.3-alpine AS builder
WORKDIR /app

# Manifests first for layer caching. Shared @ge/* packages export raw TS source
# consumed at build time, so copy packages before install.
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/console/package.json ./apps/console/
COPY apps/docs/package.json ./apps/docs/
COPY apps/presentation/package.json ./apps/presentation/
COPY apps/factory/package.json ./apps/factory/
RUN bun install --frozen-lockfile --ignore-scripts

# Sources: the console (built), the toolchain + generator (imported by the server),
# and presentation (its slides are the source for the use-case catalog).
COPY apps/console ./apps/console
COPY tools ./tools
COPY apps/factory ./apps/factory
COPY apps/presentation ./apps/presentation

RUN bun run --cwd apps/console build
# Use-case catalog is a generated artifact (git-ignored); the server reads it at
# runtime. Generated from the presentation slides.
RUN cd apps/factory && bun scripts/sync-use-cases-from-slides.mjs

# ── production stage ──────────────────────────────────────────────────────────
FROM oven/bun:1.3-alpine
WORKDIR /app

COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/console/package.json ./apps/console/
COPY apps/docs/package.json ./apps/docs/
COPY apps/factory/package.json ./apps/factory/
# presentation manifest is required for --frozen-lockfile to reconcile the
# workspace (it's in bun.lock), even though no presentation source runs here.
COPY apps/presentation/package.json ./apps/presentation/
RUN bun install --frozen-lockfile --production --ignore-scripts

# Built SPA + the server and the modules it imports at runtime.
COPY --from=builder /app/apps/console/dist ./apps/console/dist
COPY apps/console/server.js ./apps/console/
COPY apps/console/src/server ./apps/console/src/server
COPY apps/console/src/shared ./apps/console/src/shared
COPY tools ./tools
COPY apps/factory/src ./apps/factory/src
COPY apps/factory/scripts ./apps/factory/scripts
COPY --from=builder /app/apps/factory/generated ./apps/factory/generated

WORKDIR /app/apps/console
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["bun", "server.js"]
