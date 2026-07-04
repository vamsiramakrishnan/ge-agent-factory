---
type: Proof Obligation
title: "Golden eval obligation — Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?"
description: golden eval proof obligation
source_id: "eval-fiber-cut-triage-agent-conflicting-stale-evidence"
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

# Golden eval obligation — Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [fiber-cut-triage-agent-conflicting-stale-evidence](/tests/fiber-cut-triage-agent-conflicting-stale-evidence.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_fiber_cut_triage_agent_assurance_runbook](/tools/lookup-fiber-cut-triage-agent-assurance-runbook.md)

## Entities that must be referenced

- network_alarms
- tickets
- log_events

## Forbidden behaviors

- closing the alarm or standing down the crew based on the resolved ticket alone
- treating the absence of recent log activity as confirmation that the fault is resolved

# Citations

- [fiber-cut-triage-agent-assurance-runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)
