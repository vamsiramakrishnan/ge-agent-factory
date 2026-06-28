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
ENV PATH="/root/.local/bin:${PATH}"

# gcloud CLI (some stages shell out to it).
RUN apt-get update \
  && apt-get install -y --no-install-recommends apt-transport-https ca-certificates curl gnupg \
  && curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg \
  && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" > /etc/apt/sources.list.d/google-cloud-sdk.list \
  && apt-get update \
  && apt-get install -y --no-install-recommends google-cloud-cli \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

# agents-cli as a shared uv tool (so stages skip `uv tool install`).
RUN uv tool install google-agents-cli

# Warm the uv cache with the common agent deps so per-agent `uv sync` avoids
# network downloads. Include google-antigravity so remote harness stages can be
# moved into Cloud Build isolation without losing the development runtime.
RUN uv pip install --system google-antigravity google-adk "google-adk[eval]" "pydantic>=2" "pytest>=8" || true
