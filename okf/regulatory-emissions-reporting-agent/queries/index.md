---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull today's emissions_readings and permit_records from Sphera EHS and correlate them with sensor_readings from the OSIsoft PI System so every CEMS-derived co2e_tonnes value has a matching continuous monitor reading before the reporting clock starts.](/queries/continuous-emissions-permit-data-pull.md)
- [Compare each emission_source's co2e_tonnes trend against historical_metrics and cached_aggregates baselines in BigQuery to flag any pollutant rolling average heading toward its permit_limit_tonnes before the quarter closes.](/queries/rolling-average-threshold-screening.md)
- [Cross-reference emissions_readings flagged exceedance=true against downtime_events and asset_tag_hierarchies from the OSIsoft PI System to attribute the deviation to a specific asset_number and downtime_category rather than reporting a bare number.](/queries/exceedance-downtime-reconciliation.md)
- [Look up the governing sections of the Regulatory Emissions Reporting Agent Standard Operating Procedure and the Title V Deviation Reporting & Emission Factor Rate Manual before any exceedance or measurement-method finding is allowed into a draft.](/queries/sop-rate-manual-evidence-gate.md)
- [Execute action_sphera_ehs_draft to generate the Title V/NSPS submission package with calculation lineage attached, log the generated_audit_trail, and route the package to the Environmental Compliance Specialist for review and sign-off.](/queries/draft-submission-audit-trail.md)
