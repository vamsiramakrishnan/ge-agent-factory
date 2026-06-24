# GE Agent Factory — Cloud Run worker image (ge-agent-factory-worker).
#
# Build CONTEXT must be the repository ROOT, not apps/ge-demo-generator. The worker
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
#   gcloud builds submit --config apps/ge-demo-generator/cloudbuild.worker.yaml \
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
# google-agents-cli pinned <0.3: the generated-workspace eval flow runs
# `agents-cli eval run --all`, which 0.3+ removed (0.5 reworked eval into
# generate/grade eval-cases). TODO: migrate the eval flow to the 0.5 model.
# --break-system-packages: newer uv enforces PEP 668 on the externally-managed
# Debian system interpreter; the worker installs into --system deliberately.
RUN uv tool install 'google-agents-cli>=0.2,<0.3' \
  && uv pip install --system --break-system-packages google-antigravity google-adk "google-adk[eval]" "pydantic>=2" "pytest>=8"

# Workspace manifests first for layer caching. The worker's @ge/* deps are
# `workspace:*`, so bun needs the root manifest + lockfile + every workspace member's
# package.json + the packages/ sources to resolve the workspace graph.
COPY package.json bun.lock ./
COPY packages ./packages
COPY apps/console/package.json apps/console/
COPY apps/presentation/package.json apps/presentation/
COPY apps/ge-demo-generator/package.json apps/ge-demo-generator/
# Full workspace install (NOT --ignore-scripts: the worker uses better-sqlite3, whose
# native binding must be compiled — build-essential + python3 above provide the toolchain).
RUN bun install --frozen-lockfile

# tools/lib/* shared libs the worker imports at runtime (../../../tools/lib/...).
COPY tools ./tools
# App sources (scripts/factory-worker.mjs entrypoint + src/*).
COPY apps/ge-demo-generator ./apps/ge-demo-generator

WORKDIR /app/apps/ge-demo-generator

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["scripts/factory-worker.mjs"]
