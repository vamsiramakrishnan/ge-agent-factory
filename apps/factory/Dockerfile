# GE Agent Factory — Cloud Run worker image (ge-agent-factory-worker).
#
# Build CONTEXT must be the repository ROOT, not apps/factory. The worker
# runs from source (`node scripts/factory-worker.mjs`) and imports in-repo workspace
# packages that live OUTSIDE the app dir:
#   - @ge/run-ledger  (src/factory-worker.js → "@ge/run-ledger/frames", runtime)
#   - @ge/okf         (scripts/*.mjs)
# plus shared libs under tools/lib/* (src/factory-worker.js → ../../../tools/lib/...).
# Both @ge/* deps are declared `workspace:*`, which only bun/pnpm/yarn resolve — npm
# hard-fails on the workspace: protocol. So the install is a bun workspace install from
# the repo root (mirrors apps/presentation/Dockerfile), while the runtime stays node.
#
# The deploy plumbing (tools/lib/factory-plane.mjs `build`) builds via Cloud Build with
# the repo root as the source/context, then Terraform binds the image:
#   gcloud builds submit --config apps/factory/cloudbuild.worker.yaml \
#       --substitutions _IMAGE=<tag> <repoRoot>
FROM node:20-bookworm-slim

ENV UV_LINK_MODE=copy
ENV PATH="/root/.local/bin:/root/.bun/bin:${PATH}"

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg python3 python3-venv tar gzip unzip build-essential \
  && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" > /etc/apt/sources.list.d/google-cloud-sdk.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends google-cloud-cli \
  && curl -LsSf https://astral.sh/uv/install.sh | sh \
  && curl -fsSL https://bun.sh/install | bash \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Remote harness runtime. The Cloud Run worker owns the harness_refine stage, so
# google-antigravity must be importable from python3 inside this image. agents-cli
# is installed here as well because generated workspace quality gates use it.
# The generated-workspace eval flow uses the current generate/grade contract.
# Read one checked-in version so local, worker, and builder surfaces cannot drift.
# --break-system-packages: newer uv enforces PEP 668 on the externally-managed
# Debian system interpreter; the worker installs into --system deliberately.
COPY apps/factory/agents-cli-version.txt /opt/ge/agents-cli-version.txt
RUN uv tool install "google-agents-cli==$(cat /opt/ge/agents-cli-version.txt)" \
  && uv pip install --system --break-system-packages google-antigravity google-adk "google-adk[eval]" "pydantic>=2" "pytest>=8"

# Workspace manifests first for layer caching. The worker's @ge/* deps are
# `workspace:*`, so bun needs the root manifest + lockfile + every workspace member's
# package.json + the packages/ sources to resolve the workspace graph.
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/console/package.json apps/console/
COPY apps/docs/package.json apps/docs/
COPY apps/presentation/package.json apps/presentation/
COPY apps/factory/package.json apps/factory/
# Cloud worker state is Firestore/GCS/Cloud Tasks; the SQLite ledger adapter is
# local/test-only and openRunLedger falls back when no native driver is present.
# Keep image builds deterministic by avoiding native install scripts such as
# better-sqlite3's node-gyp compile.
RUN bun install --frozen-lockfile --production --ignore-scripts

# tools/lib/* shared libs the worker imports at runtime (../../../tools/lib/...).
COPY tools ./tools
# App sources (scripts/factory-worker.mjs entrypoint + src/*).
COPY apps/factory ./apps/factory
# Keep remote harness parity with local: the worker image carries the generated
# use-case catalog artifact that Antigravity/tools can read during review/refine.
COPY apps/presentation/src/components/slides/use-cases ./apps/presentation/src/components/slides/use-cases
RUN cd apps/factory && bun scripts/sync-use-cases-from-slides.mjs

WORKDIR /app/apps/factory

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["scripts/factory-worker.mjs"]
