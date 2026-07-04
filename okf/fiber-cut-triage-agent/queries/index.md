---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull new network_alarms from Ericsson Network Manager via query_ericsson_network_manager_network_alarms and correlate alarm_id/ne_id/site_id against open tickets and incidents in ServiceNow to confirm this is a backbone fiber_cut rather than a transient link_down or high_ber flap.](/queries/alarm-intake-ticket-correlation.md)
- [Score cell_sites and performance_counters (rsrp_avg_dbm, sinr_avg_db, cell_availability_pct) against BigQuery analytics_events and historical_metrics baselines to size the customer- and mobile-site-impact radius and set severity ahead of dispatch.](/queries/blast-radius-severity-scoring.md)
- [Query Splunk log_events and their linked search_jobs for prior OTDR/reflectometry runs or crew actions on the same ne_id, so the agent never re-triggers a live diagnostic shot on a span already being worked.](/queries/diagnostic-history-prior-work-check.md)
- [Look up the Fiber Cut Triage Agent Service Assurance Runbook via lookup_fiber_cut_triage_agent_assurance_runbook to confirm service-impact classification and staleness thresholds, citing the governing section before any recommendation or dispatch is issued.](/queries/runbook-validation-citation.md)
- [Trigger the automatic traffic reroute where a protection path exists, execute action_servicenow_route to open the master incident and route the ServiceNow ticket, and notify the NOC Engineer and affected enterprise customers with the audit trail attached.](/queries/reroute-route-notify.md)
