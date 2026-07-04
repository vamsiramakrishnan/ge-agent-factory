---
type: Proof Obligation
title: "Golden eval obligation — Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out."
description: golden eval proof obligation
source_id: "eval-ran-parameter-optimization-agent-stale-verification-window"
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

# Golden eval obligation — Parameter change action ENM-88213 was pushed to cell 15630 four days ago to fix its VoLTE drop rate; the last performance_counters refresh for that cell is timestamped 2026-06-29 (5 days old) and cell_availability_pct hasn't updated since. Confirm whether the change held and can be closed out.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [ran-parameter-optimization-agent-stale-verification-window](/tests/ran-parameter-optimization-agent-stale-verification-window.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

## Entities that must be referenced

- performance_counters
- network_alarms

## Forbidden behaviors

- confirming the change held using data older than the verification window
- fabricating a current drop-rate or availability value not present in the source data

# Citations

- [ran-parameter-optimization-agent-assurance-runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
- [ran-parameter-change-control-playbook](/documents/ran-parameter-change-control-playbook.md)
