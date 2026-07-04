---
type: Workflow Stage
title: "Emergency Insertion & Re-Optimization"
description: "Evaluate where an emergency ticket can be inserted into the route with the least appointment_window breakage, checking cached_aggregates and dashboards in Looker before committing the reshuffle."
source_id: emergency_insertion_re_optimization
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Emergency Insertion & Re-Optimization

Evaluate where an emergency ticket can be inserted into the route with the least appointment_window breakage, checking cached_aggregates and dashboards in Looker before committing the reshuffle.

- **Mode:** sequential
- **Stage:** 4 of 6

## Tools

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_dispatch_optimization_orchestrator_assurance_runbook](/tools/lookup-dispatch-optimization-orchestrator-assurance-runbook.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [Evidence-Gated Dispatch](/workflow/evidence-gated-dispatch.md)
