# GE Agent Factory gateway image.
# Owns /api/factory/* and dispatches real cloud work through Cloud Tasks + worker.
# Presentation UI images must not carry this runtime surface.

FROM oven/bun:1.3-alpine
WORKDIR /app

COPY package.json bun.lock ./
COPY packages ./packages
COPY tools ./tools
COPY apps/factory/package.json apps/factory/
COPY apps/console/package.json apps/console/
COPY apps/presentation/package.json apps/presentation/
RUN bun install --frozen-lockfile --production --ignore-scripts

COPY apps/factory/scripts ./apps/factory/scripts
COPY apps/factory/src ./apps/factory/src
COPY apps/factory/generated ./apps/factory/generated
COPY apps/factory/cloudbuild.factory-stage.yaml ./apps/factory/cloudbuild.factory-stage.yaml
COPY apps/factory/cloudbuild.factory-stage.full.yaml ./apps/factory/cloudbuild.factory-stage.full.yaml

WORKDIR /app/apps/factory
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["bun", "scripts/factory-gateway.mjs"]
