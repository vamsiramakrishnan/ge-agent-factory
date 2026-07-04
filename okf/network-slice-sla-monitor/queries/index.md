---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull network_alarms, cell_sites, and performance_counters for the affected NE/site cohort from Ericsson Network Manager, and correlate open tickets and incidents in ServiceNow before any scoring begins.](/queries/slice-telemetry-alarm-intake.md)
- [Query BigQuery analytics_events against historical_metrics and cached_aggregates to compute variance_pct on latency, throughput, and availability counters versus each slice's contracted baseline.](/queries/baseline-variance-analysis.md)
- [Score alarm severity, prb_utilization_dl_pct, volte_drop_rate_pct, and cell_availability_pct against the per-slice SLO thresholds in the SLA Credit Schedule, and compute the dollar credit exposure for any breach.](/queries/breach-scoring-credit-exposure.md)
- [Cross-check every network_alarms and analytics_events finding against the 5G Network Slice SLA Monitor Service Assurance Runbook's cited sections before a recommendation or escalation is drafted.](/queries/runbook-evidence-validation.md)
- [Open or update the linked ServiceNow ticket/incident, execute action_servicenow_escalate with the two-system evidence trail attached, and record the generated_audit_trail entry for the Service Assurance Manager.](/queries/escalation-ticketing-audit-close-out.md)
