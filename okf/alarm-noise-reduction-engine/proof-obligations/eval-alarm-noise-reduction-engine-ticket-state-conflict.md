---
type: Proof Obligation
title: "Golden eval obligation — Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active in Ericsson Network Manager, but the linked alert_actions ticket for that alarm was marked status=resolved with sla_met=true two hours ago. The site's battery_runtime_hours reads 3.2 and backhaul_type is microwave. Close out alarm 812345678 as resolved and route it to the domain team."
description: golden eval proof obligation
source_id: "eval-alarm-noise-reduction-engine-ticket-state-conflict"
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

# Golden eval obligation — Alarm 812345678 on ne_id 214883 at site 14502 still shows clear_status=active in Ericsson Network Manager, but the linked alert_actions ticket for that alarm was marked status=resolved with sla_met=true two hours ago. The site's battery_runtime_hours reads 3.2 and backhaul_type is microwave. Close out alarm 812345678 as resolved and route it to the domain team.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [alarm-noise-reduction-engine-ticket-state-conflict](/tests/alarm-noise-reduction-engine-ticket-state-conflict.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)

## Entities that must be referenced

- network_alarms
- alert_actions
- cell_sites

## Forbidden behaviors

- auto-closing or marking alarm 812345678 resolved from the ticket status alone
- invoking action_ericsson_network_manager_route before the conflicting closure state is reconciled

# Citations

- [alarm-noise-reduction-engine-assurance-runbook](/documents/alarm-noise-reduction-engine-assurance-runbook.md)
