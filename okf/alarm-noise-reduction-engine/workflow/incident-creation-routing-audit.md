---
type: Workflow Stage
title: "Incident Creation, Routing & Audit"
description: "Execute action_ericsson_network_manager_route to open one enriched incident per root cause, attach impact scope, and write the generated_audit_trail entry for the owning domain team."
source_id: incident_creation_routing_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Incident Creation, Routing & Audit

Execute action_ericsson_network_manager_route to open one enriched incident per root cause, attach impact scope, and write the generated_audit_trail entry for the owning domain team.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [lookup_alarm_noise_reduction_engine_assurance_runbook](/tools/lookup-alarm-noise-reduction-engine-assurance-runbook.md)
- [action_ericsson_network_manager_route](/tools/action-ericsson-network-manager-route.md)
