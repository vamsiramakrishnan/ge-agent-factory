---
name: ge-api-service-adapter
description: |
  Use when a GE use case includes REST APIs, GraphQL, gRPC, RFC/BAPI, SOAP,
  SFTP/API, MCP, or other service interfaces. Generates fixture-backed source
  adapter contracts: OpenAPI, MCP SSE tool manifests, optional Cloud Run/API
  Gateway deployment notes, and ADK tool wiring guidance.
triggers:
  - "API"
  - "REST"
  - "GraphQL"
  - "gRPC"
  - "MCP"
  - "service adapter"
  - "source adapter"
  - "mc-systems"
  - "OpenAPI"
  - "API Gateway"
outputs:
  primary: mock_data/apis/source-adapters.json
  secondary: [mock_data/apis/openapi.json, mock_data/apis/mcp-tools.json, mock_data/apis/fixtures/, mock_data/apis/mcp-adapter/, mock_data/apis/deploy-adapter.sh]
resources:
  scripts:
    - path: scripts/check-api-package.mjs
      purpose: Validate generated API/MCP adapter package files exist.
      use_when: Auditing a workspace after factory plan-data.
  references:
    - path: references/api-adapter-contract.md
      purpose: API, MCP, idempotency, and evidence contract.
      use_when: Designing or auditing source adapter packages.
    - path: references/mc-systems-pattern.md
      purpose: Pattern extracted from mc-systems services.
      use_when: Generating Express + MCP SSE adapters.
  assets:
    - path: assets/source-adapter-package.yaml
      purpose: Template package manifest for service adapters.
      use_when: Creating mock_data/apis/source-adapters.json or equivalent YAML.
---

# GE API Service Adapter

Use this skill when a source system is a service boundary, not just a datastore.

## Flow

```bash
factory sources --slides ../../src/components/slides/use-cases
factory plan-data --dir <workspace> --usecase <UseCaseName>
node .gemini/skills/ge-api-service-adapter/scripts/check-api-package.mjs --dir <workspace>
```

`factory plan-data` owns generation. It should emit API artifacts under `mock_data/apis/` whenever the use-case source map includes service protocols.

## Rules

- Public language: say `source adapters`, `service adapters`, or `fixture-backed adapters`.
- Avoid calling generated ADK functions “mock tools” in user-facing text.
- Keep local adapters deterministic and fixture-backed.
- JSON-backed APIs are the default local implementation; write deterministic request/response fixtures under `mock_data/apis/fixtures/`.
- Write-like operations must require an `idempotencyKey`.
- API evidence must include `source_system_record` and `generated_audit_trail`.
- MCP adapters should expose SSE endpoints `/sse` and `/messages`, matching the `mc-systems` pattern.
- Do not deploy Cloud Run/API Gateway unless explicitly requested.

## Compose

- Use `ge-usecase-source-mapper` first to detect service protocols.
- Use `ge-cloud-mock-data` for datastore packages.
- Use this skill for `mock_data/apis/openapi.json`, `mock_data/apis/fixtures/`, `mock_data/apis/mcp-tools.json`, and `mock_data/apis/mcp-adapter/`.

## Bundled Resources

- `references/api-adapter-contract.md`: load when auditing API package quality.
- `references/mc-systems-pattern.md`: load when generating Express/MCP adapter code.
- `assets/source-adapter-package.yaml`: adapt for manifest shape.
- `scripts/check-api-package.mjs`: run after generation.
