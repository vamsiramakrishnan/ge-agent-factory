---
type: Query Capability
title: "Update risk register in ServiceNow GRC with new scores, treatment recommendat..."
description: "Update risk register in ServiceNow GRC with new scores, treatment recommendations, and KRI trends. Generate board-ready risk summary."
source_id: "register-update"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Update risk register in ServiceNow GRC with new scores, treatment recommendations, and KRI trends. Generate board-ready risk summary.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [lookup_risk_register_agent_runbook](/tools/lookup-risk-register-agent-runbook.md)
- [action_servicenow_grc_assign](/tools/action-servicenow-grc-assign.md)

## Runs in

- [register_update](/workflow/register-update.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/risk-register-agent-end-to-end.md)

# Citations

- [Risk Register Agent Operations Runbook](/documents/risk-register-agent-runbook.md)
