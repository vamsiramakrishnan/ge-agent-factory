---
type: Eval Scenario
title: "Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thur..."
description: "Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?"
source_id: "number-porting-exception-agent-fcc-interval-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Consumer port-in order 73982210 was submitted at 4:45pm on 2026-07-02 (a Thursday) and is still order_status in_flight with fallout_status none as of this morning, 2026-07-03. It's a simple port with no LNP complexity flags. BigQuery's analytics_events shows the current-week rejection baseline running at 9.5%. Is this order breaching the FCC simple-port interval, and what should the desk do?

## Validates

- [port-rejection-intake-csr-comparison](/queries/port-rejection-intake-csr-comparison.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_number_porting_exception_agent_assurance_runbook](/tools/lookup-number-porting-exception-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [LNP Reject Reason Code & Porting Interval Manual](/documents/lnp-reject-code-and-interval-manual.md)
