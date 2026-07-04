---
type: Proof Obligation
title: "Golden eval obligation — Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-esim-activation-orchestrator-end-to-end"
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

# Golden eval obligation — Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [esim-activation-orchestrator-end-to-end](/tests/esim-activation-orchestrator-end-to-end.md)


## Mechanisms

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

## Entities that must be referenced

- service_orders
- analytics_events
- log_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [esim-activation-orchestrator-assurance-runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
