# Shared builder image for the factory's Cloud Build release stages.
#
# The 363 per-agent builds all need the SAME toolchain (uv, gcloud, agents-cli)
# and the SAME base Python deps (google-adk[eval], pydantic, pytest). Re-
# installing those on every stage of every agent is the bulk of the build time.
# This image bakes the common toolchain once and warms the uv cache so each
# agent's `uv sync` is a cache hit and no stage re-installs agents-cli — while
# each agent still builds/deploys in its own isolated Cloud Build run.
#
# Build + push via `ge build builder`. The worker passes this image to the
# stage build as _BUILDER_IMAGE; if unset, the stages fall back to the public uv
# base image and install on demand (slower, but still works).
FROM ghcr.io/astral-sh/uv:python3.11-bookworm

ENV UV_LINK_MODE=copy
ENV UV_CACHE_DIR=/root/.cache/uv
ENV PATH="/root/.bun/bin:/root/.local/bin:${PATH}"

COPY cloudbuild/run-factory-stage.sh /usr/local/bin/ge-factory-run-stage
COPY cloudbuild/run-deployed-smoke.mjs /opt/ge/run-deployed-smoke.mjs
COPY agents-cli-version.txt /opt/ge/agents-cli-version.txt
RUN chmod +x /usr/local/bin/ge-factory-run-stage

# gcloud CLI (some stages shell out to it).
RUN apt-get update \
  && apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg nodejs npm unzip \
  && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" > /etc/apt/sources.list.d/google-cloud-sdk.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends google-cloud-cli \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# Bun is useful for generated projects and operator scripts that assume the same
# JS runtime as the factory repo.
RUN curl -fsSL https://bun.sh/install | bash

# agents-cli as a shared, version-locked uv tool (so every surface runs the
# same scaffold/eval/deploy/publish contract).
RUN uv tool install "google-agents-cli==$(cat /opt/ge/agents-cli-version.txt)"

# Warm the uv cache with the common agent deps so per-agent `uv sync` avoids
# network downloads. Include google-antigravity so remote harness stages can be
# moved into Cloud Build isolation without losing the development runtime.
RUN mkdir -p /tmp/ge-builder-warm \
  && cd /tmp/ge-builder-warm \
  && printf '%s\n' \
    '[project]' \
    'name = "ge-builder-warm"' \
    'version = "0.0.0"' \
    'requires-python = ">=3.11"' \
    'dependencies = ["google-antigravity", "google-adk", "pydantic>=2", "pytest>=8"]' \
    '' \
    '[project.optional-dependencies]' \
    'eval = ["google-adk[eval]", "rouge-score", "litellm", "pandas", "scikit-learn", "nltk", "tqdm"]' \
    'lint = ["ruff"]' \
    > pyproject.toml \
  && uv sync --extra eval --extra lint --no-install-project \
  && uv pip install --system google-antigravity google-adk "google-adk[eval]" "pydantic>=2" "pytest>=8" \
  && rm -rf /tmp/ge-builder-warm
