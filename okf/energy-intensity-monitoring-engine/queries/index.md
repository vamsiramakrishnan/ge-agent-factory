---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull sensor_readings and asset_tag_hierarchies from OSIsoft PI System and join them against production output so kWh consumption lands per line and per product, not just per meter.](/queries/meter-to-production-reconciliation.md)
- [Compare the reconciled intensity figure against weather- and volume-normalized analytics_events and historical_metrics in BigQuery to flag any line or shift that has drifted off its baseline.](/queries/baseline-anomaly-detection.md)
- [Walk asset_tag_hierarchies down to the equipment_unit level and cross-reference downtime_events reason codes in OSIsoft PI System to name the specific asset most likely driving the anomaly, ruling out planned_maintenance or changeover explanations.](/queries/equipment-attribution-downtime-cross-check.md)
- [Validate the finding against the Energy Intensity Monitoring Engine Standard Operating Procedure and check permit_records and emissions_readings in Sphera EHS so a conservation recommendation never collides with an active LOTO, hot-work, or Title V constraint.](/queries/sop-permit-evidence-gate.md)
- [Publish the top three conservation actions with quantified kWh and dollar savings via action_sphera_ehs_publish, with the audit trail attached, and refresh the intensity trend view in Looker dashboards for the Sustainability Lead.](/queries/conservation-action-publish-dashboard-refresh.md)
