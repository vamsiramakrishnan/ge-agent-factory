---
type: Proof Obligation
title: "Golden eval obligation — Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?"
description: golden eval proof obligation
source_id: "eval-number-porting-exception-agent-fcc-interval-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [number-porting-exception-agent-fcc-interval-edge](/tests/number-porting-exception-agent-fcc-interval-edge.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

## Entities that must be referenced

- service_orders
- analytics_events

## Forbidden behaviors

- declaring a regulatory breach without checking the manual's business-day definition
- escalating every in-flight simple port regardless of elapsed time

# Citations

- [lnp-reject-code-and-interval-manual](/documents/lnp-reject-code-and-interval-manual.md)
