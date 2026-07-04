---
type: Eval Scenario
title: "Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 ..."
description: "Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?"
source_id: "npi-launch-readiness-orchestrator-recovery-runway-escalation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Program Falcon-7's gate date is 2026-08-10 (26 business days out). ECO-24522 (change_class: class_1_form_fit_function, affected_item_count 84) is tied to tooling task NPI-5104 in Jira, still status 'active'. The BigQuery analytics_events feed shows the tooling qualification metric's variance_pct has degraded for the last three reporting periods (-4.2%, then -11.6%, then -18.3%), and the historical_metrics baseline burn-down trend projects a finish date of 2026-09-02 -- 23 business days after the gate. The function lead says 'this is still fine, we'll catch up.' What should the agent do?

## Validates

- [gate-deliverable-reconciliation](/queries/gate-deliverable-reconciliation.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_npi_launch_readiness_orchestrator_sop](/tools/lookup-npi-launch-readiness-orchestrator-sop.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [NPI Launch Readiness Orchestrator Standard Operating Procedure](/documents/npi-launch-readiness-orchestrator-sop.md)
- [Engineering Change Control Board Authority & Effectivity Matrix](/documents/eccb-authority-effectivity-matrix.md)
