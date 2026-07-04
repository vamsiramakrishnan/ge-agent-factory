---
type: Query Capability
title: "Generate audit-ready workpapers with test results, evidence references, and a..."
description: "Generate audit-ready workpapers with test results, evidence references, and assessment narratives. Create remediation tickets for gaps."
source_id: "workpaper-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate audit-ready workpapers with test results, evidence references, and assessment narratives. Create remediation tickets for gaps.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Runs in

- [workpaper_generation](/workflow/workpaper-generation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-control-testing-agent-end-to-end.md)

# Citations

- [IT Control Testing Agent Operations Runbook](/documents/it-control-testing-agent-runbook.md)
