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
COPY apps/docs/package.json apps/docs/
COPY apps/presentation/package.json apps/presentation/
RUN bun install --frozen-lockfile --production --ignore-scripts

COPY apps/factory/scripts ./apps/factory/scripts
COPY apps/factory/src ./apps/factory/src
COPY apps/factory/catalog ./apps/factory/catalog
# Build the git-ignored use-case catalog artifact inside the image. The gateway
# imports the same lazy catalog loader as local mode, and the sync reads slide
# use-case definitions from apps/presentation.
COPY apps/presentation/src/components/slides/use-cases ./apps/presentation/src/components/slides/use-cases
RUN cd apps/factory && bun scripts/sync-use-cases-from-slides.mjs
COPY apps/factory/cloudbuild.factory-stage.yaml ./apps/factory/cloudbuild.factory-stage.yaml

WORKDIR /app/apps/factory
EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

CMD ["bun", "scripts/factory-gateway.mjs"]
