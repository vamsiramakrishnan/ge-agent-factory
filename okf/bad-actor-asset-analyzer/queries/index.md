---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query maintenance_work_orders, asset_registry_entries, and failure_codes from IBM Maximo and correlate against sensor_readings and downtime_events from OSIsoft PI System to build the candidate asset population for the period.](/queries/bad-actor-candidate-pull.md)
- [Score each candidate asset on a weighted index of repair cost (maintenance_work_orders), downtime contribution (downtime_events), and failure frequency (failure_codes.occurrences_ytd), normalizing against historical_metrics and analytics_events baselines in BigQuery.](/queries/composite-index-scoring.md)
- [Cluster each ranked asset's work order narratives against failure_codes.failure_mode and failure_mechanism to summarize the recurring mechanism driving its bad-actor status.](/queries/failure-mode-clustering.md)
- [Cross-check the ranking and any criticality or vibration-zone findings against the Bad Actor Asset Analyzer Standard Operating Procedure and the Asset Criticality Ranking & ISO 10816/20816 Vibration Severity Playbook, citing governing sections before any recommendation is issued.](/queries/sop-and-playbook-evidence-gate.md)
- [Generate the defect-elimination candidate briefing with projected savings, publish the ranking to Looker dashboards, and execute action_ibm_maximo_publish in IBM Maximo with a full audit trail, escalating exceptions to the Reliability Engineer.](/queries/defect-elimination-briefing-and-publish.md)
