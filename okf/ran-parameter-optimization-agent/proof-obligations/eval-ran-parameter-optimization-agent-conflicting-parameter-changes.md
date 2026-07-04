---
type: Proof Obligation
title: "Golden eval obligation — Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review."
description: golden eval proof obligation
source_id: "eval-ran-parameter-optimization-agent-conflicting-parameter-changes"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Site 14892 in the Dallas-Ft Worth market has a pending tilt increase from the coverage team (change ticket 2043211) queued for this Thursday's window, and performance_counters show PRB utilization already at 91% with an energy-saving power reduction applied to the same site last Tuesday. Recommend whether to proceed with the tilt change for this week's cluster review.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [ran-parameter-optimization-agent-conflicting-parameter-changes](/tests/ran-parameter-optimization-agent-conflicting-parameter-changes.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ran_parameter_optimization_agent_assurance_runbook](/tools/lookup-ran-parameter-optimization-agent-assurance-runbook.md)

## Entities that must be referenced

- cell_sites
- performance_counters
- network_alarms

## Forbidden behaviors

- recommending the tilt change without surfacing the competing energy-saving change
- treating PRB utilization above 90% on the same cell as a routine tuning case rather than an escalation-relevant condition

# Citations

- [ran-parameter-change-control-playbook](/documents/ran-parameter-change-control-playbook.md)
- [ran-parameter-optimization-agent-assurance-runbook](/documents/ran-parameter-optimization-agent-assurance-runbook.md)
