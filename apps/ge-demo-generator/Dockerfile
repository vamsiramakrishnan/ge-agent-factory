FROM node:20-bookworm-slim

ENV UV_LINK_MODE=copy
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg python3 python3-venv tar gzip build-essential \
  && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" > /etc/apt/sources.list.d/google-cloud-sdk.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends google-cloud-cli \
  && curl -LsSf https://astral.sh/uv/install.sh | sh \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Remote harness runtime. The Cloud Run worker owns the harness_refine stage, so
# google-antigravity must be importable from python3 inside this image. agents-cli
# is installed here as well because generated workspace quality gates use it.
# google-agents-cli pinned <0.3: the generated-workspace eval flow runs
# `agents-cli eval run --all`, which 0.3+ removed (0.5 reworked eval into
# generate/grade eval-cases). TODO: migrate the eval flow to the 0.5 model.
RUN uv tool install 'google-agents-cli>=0.2,<0.3' \
  && uv pip install --system google-antigravity google-adk "google-adk[eval]" "pydantic>=2" "pytest>=8"

COPY package*.json ./
# Repo is bun-managed; this package has no package-lock.json, so `npm ci`
# (which requires a lockfile) fails. Use npm install for the worker image.
RUN npm install --omit=dev --no-audit --no-fund

COPY . .

ENTRYPOINT ["/usr/local/bin/node"]
CMD ["scripts/factory-worker.mjs"]
