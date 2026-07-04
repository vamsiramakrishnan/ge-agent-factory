---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull customer_interactions from Genesys Cloud CX and reclassify the true contact intent from channel, intent, cpni_authenticated, and agent_notes signals, overriding unreliable agent disposition codes per the Contact Driver Taxonomy & Cost-to-Serve Standard.](/queries/contact-reason-mining-disposition-override.md)
- [Compare analytics_events variance_pct against historical_metrics and cached_aggregates baselines in BigQuery across consecutive metric_date periods to flag statistically significant emerging complaint clusters.](/queries/emerging-cluster-baseline-detection.md)
- [Query Looker dashboards and metric_definitions to rank contact drivers by volume and estimated cost-to-serve, prioritizing the Care Team Lead's queue toward the highest-cost, fastest-growing drivers.](/queries/cost-to-serve-ranking-driver-prioritization.md)
- [Cite the Complaint Root Cause Analyzer Service Assurance Runbook and the Contact Driver Taxonomy & Cost-to-Serve Standard sections that gate publication before any ranked contact-driver report or defect narrative is issued.](/queries/evidence-validation-runbook-citation.md)
- [Execute action_genesys_cloud_cx_route to hand confirmed defect cases to the owning product or billing team in Genesys Cloud CX with a full audit trail, and escalate exceptions per the governance triggers.](/queries/defect-routing-audit.md)
