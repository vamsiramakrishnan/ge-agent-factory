---
type: Query Capability
title: "Execute the escalate step in Murex MX.3 with a full audit trail, and escalate..."
description: "Execute the escalate step in Murex MX.3 with a full audit trail, and escalate exceptions to the Treasury Operations Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the escalate step in Murex MX.3 with a full audit trail, and escalate exceptions to the Treasury Operations Analyst.

## Tools used

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trade-confirmation-break-resolution-agent-end-to-end.md)

# Citations

- [Trade Confirmation Break Resolution Agent Banking Compliance Policy](/documents/trade-confirmation-break-resolution-agent-compliance-policy.md)
