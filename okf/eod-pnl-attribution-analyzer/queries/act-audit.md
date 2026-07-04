---
type: Query Capability
title: "Execute the publish step in Murex MX.3 with a full audit trail, and escalate ..."
description: "Execute the publish step in Murex MX.3 with a full audit trail, and escalate exceptions to the Product Control Analyst."
source_id: "act-audit"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Murex MX.3 with a full audit trail, and escalate exceptions to the Product Control Analyst.

## Tools used

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the End-of-Day P&L Attribution Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eod-pnl-attribution-analyzer-end-to-end.md)

# Citations

- [End-of-Day P&L Attribution Analyzer Banking Compliance Policy](/documents/eod-pnl-attribution-analyzer-compliance-policy.md)
