---
type: Query Capability
title: "Execute approved decisions: add adopted apps to service catalog, configure mo..."
description: "Execute approved decisions: add adopted apps to service catalog, configure monitoring for watched apps, block and notify users of restricted apps with approved alternatives."
source_id: "policy-enforcement"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute approved decisions: add adopted apps to service catalog, configure monitoring for watched apps, block and notify users of restricted apps with approved alternatives.

## Tools used

- [query_okta_users](/tools/query-okta-users.md)
- [action_okta_approve](/tools/action-okta-approve.md)

## Runs in

- [policy_enforcement](/workflow/policy-enforcement.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

# Citations

- [Shadow IT Detector Operations Runbook](/documents/shadow-it-detector-runbook.md)
