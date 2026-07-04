---
type: Agent Tool
title: query_github_pull_requests
description: "Retrieve pull requests from GitHub for the API Catalog & Governance workflow."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_github_pull_requests

Retrieve pull requests from GitHub for the API Catalog & Governance workflow.

- **Kind:** query
- **Source system:** [GitHub](/systems/github.md)

## Inputs

- lookup_key
- date_range

## Outputs

- pull_requests_records
- pull_requests_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GitHub](/systems/github.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [api_discovery](/workflow/api-discovery.md)

## Evals

- [Run the API Catalog & Governance workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/api-catalog-governance-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- pull_requests_records
- pull_requests_summary

# Examples

```
query_github_pull_requests(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GitHub](/systems/github.md)
