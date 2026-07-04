---
type: Query Capability
title: "Execute the publish step in Siemens Opcenter MES with a full audit trail, and..."
description: "Execute the publish step in Siemens Opcenter MES with a full audit trail, and escalate exceptions to the Continuous Improvement Lead."
source_id: "act-audit"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute the publish step in Siemens Opcenter MES with a full audit trail, and escalate exceptions to the Continuous Improvement Lead.

## Tools used

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [action_siemens_opcenter_mes_publish](/tools/action-siemens-opcenter-mes-publish.md)

## Runs in

- [act_audit](/workflow/act-audit.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the OEE Loss Pareto Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/oee-loss-pareto-analyzer-end-to-end.md)

# Citations

- [OEE Loss Pareto Analyzer Standard Operating Procedure](/documents/oee-loss-pareto-analyzer-sop.md)
