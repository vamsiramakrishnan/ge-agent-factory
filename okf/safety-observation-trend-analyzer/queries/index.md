---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the week's Sphera EHS safety_incidents observation free-text via query_sphera_ehs_safety_incidents and tokenize it by area, shift (first/second/third/weekend), and task type ahead of clustering.](/queries/observation-intake-free-text-mining.md)
- [Run query_bigquery_analytics_events against historical_metrics baselines in BigQuery to cluster emerging unsafe conditions and test which clusters historically preceded recordable and lost-time DART incidents.](/queries/trend-clustering-leading-indicator-correlation.md)
- [Reconcile safety_incidents clusters against permit_records (LOTO, hot work, confined space entry) and emissions_readings exceedances so permit or atmospheric-monitoring gaps aren't mistaken for pure behavioral trends.](/queries/cross-system-evidence-reconciliation.md)
- [Call lookup_safety_observation_trend_analyzer_sop and cite the Behavior-Based Safety Observation Program Playbook's clustering thresholds before any cluster is labeled a validated leading indicator.](/queries/policy-playbook-citation-gate.md)
- [Draft targeted toolbox talk content for the highest-risk clusters and query_looker_dashboards to refresh the trend dashboard for area supervisors.](/queries/toolbox-talk-drafting-dashboard-publish.md)
- [Route LEL, Title V exceedance, cross-area recurrence, or severity-gate conditions to the Plant Safety Coordinator, then execute action_sphera_ehs_publish with a full audit trail.](/queries/escalation-publish-audit.md)
