---
type: Query Capability
title: Gemini reasons about optimal migration sequencing — which technologies to sun...
description: "Gemini reasons about optimal migration sequencing — which technologies to sunset first based on risk, dependency ordering, team capacity, and business impact. Generates migration plans with phasing."
source_id: "migration-path-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reasons about optimal migration sequencing — which technologies to sunset first based on risk, dependency ordering, team capacity, and business impact. Generates migration plans with phasing.

## Tools used

- [action_servicenow_cmdb_generate](/tools/action-servicenow-cmdb-generate.md)

## Runs in

- [migration_path_generation](/workflow/migration-path-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Technology Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technology-lifecycle-manager-end-to-end.md)

# Citations

- [Technology Lifecycle Manager Operations Runbook](/documents/technology-lifecycle-manager-runbook.md)
