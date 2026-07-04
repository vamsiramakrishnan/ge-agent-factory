---
type: Proof Obligation
title: "Golden eval obligation — Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-fiber-cut-triage-agent-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [fiber-cut-triage-agent-end-to-end](/tests/fiber-cut-triage-agent-end-to-end.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Entities that must be referenced

- network_alarms
- analytics_events
- tickets
- log_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [fiber-cut-triage-agent-assurance-runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)
