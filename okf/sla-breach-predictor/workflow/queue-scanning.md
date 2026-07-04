---
type: Workflow Stage
title: Queue Scanning
description: "Pull all open tickets with SLA timers, current assignment status, and ticket age. Calculate time remaining to breach for each SLA target (response, update, resolution)."
source_id: queue_scanning
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Queue Scanning

Pull all open tickets with SLA timers, current assignment status, and ticket age. Calculate time remaining to breach for each SLA target (response, update, resolution).

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sla_breach_predictor_runbook](/tools/lookup-sla-breach-predictor-runbook.md)

Next: [Breach Probability Modeling](/workflow/breach-probability-modeling.md)
