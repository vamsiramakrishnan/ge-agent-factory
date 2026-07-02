# Build CONTEXT must be the repository root, because the simulator engine now lives in
# its own in-repo package (packages/simulator-runtime) outside this app's directory.
#   docker build -f apps/factory/mcp-service/Dockerfile -t mcp .
# The deploy plumbing (tools/lib/mcp-plane.mjs) builds via Cloud Build with the repo root
# as the source/context, then deploys the image:
#   gcloud builds submit --config apps/factory/mcp-service/cloudbuild.yaml \
#       --substitutions _IMAGE=<tag> <repoRoot>
#   gcloud run deploy <svc> --image <tag>
FROM python:3.11-slim
WORKDIR /srv

# 1) Install the standalone simulator runtime first (its own package, no third-party
#    hard deps; the mcp-service app pulls in the firestore/alloydb extras below).
COPY packages/simulator-runtime /srv/packages/simulator-runtime
RUN pip install --no-cache-dir -e /srv/packages/simulator-runtime && rm -rf /root/.cache

# 2) Install the mcp-service app. Its pyproject depends on simulator-runtime[firestore,alloydb];
#    the editable install above already satisfies simulator-runtime, so pip only resolves
#    the extras + the rest of the app's deps from the index.
COPY apps/factory/mcp-service/pyproject.toml ./
RUN pip install --no-cache-dir . && rm -rf /root/.cache

# 3) App sources.
COPY apps/factory/mcp-service/server.py \
     apps/factory/mcp-service/store_backend.py* \
     apps/factory/mcp-service/stores.py* \
     apps/factory/mcp-service/synthesis*.py \
     ./

# 4) The pack corpus the engine serves, and where to find it. GE_SIMULATOR_SYSTEMS_DIR
#    makes the corpus location injectable (see simulator_runtime.config); pointing it at
#    the copied corpus keeps behaviour identical to the in-repo default.
COPY apps/factory/simulator-systems /srv/simulator-systems
ENV GE_SIMULATOR_SYSTEMS_DIR=/srv/simulator-systems

ENV GE_DATA_BACKEND=mcp PORT=8080
# Durable simulator state (ADR 0001). Declared with empty defaults so Cloud Run can
# override them at deploy time; unset ⇒ in-memory backend ⇒ behaviour unchanged.
#   GE_SIMULATOR_STATE_BACKEND : global backend override ("" | memory | firestore | alloydb)
#   GOOGLE_CLOUD_PROJECT       : project for Firestore ADC (firestore backend)
#   GE_AGENT_ALLOYDB_DSN       : psycopg DSN for AlloyDB (alloydb backend)
ENV GE_SIMULATOR_STATE_BACKEND="" GOOGLE_CLOUD_PROJECT="" GE_AGENT_ALLOYDB_DSN=""
EXPOSE 8080
CMD ["python", "server.py"]
