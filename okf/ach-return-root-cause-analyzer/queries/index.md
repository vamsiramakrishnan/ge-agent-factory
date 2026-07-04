---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Ingest the daily ACH return file and parse Nacha return reason codes (R01, R02, R03, R05, R07, R08, R10, R11, R29) against payment_instructions and clearing_batches in FIS Payments Hub, tagging each return with its SEC code (PPD, CCD, WEB, TEL).](/queries/return-file-ingestion-sec-code-triage.md)
- [Aggregate returns per originator and SEC code, joining analytics_events and historical_metrics in BigQuery to compute trailing-60-day unauthorized and administrative return rates against the prior baseline.](/queries/originator-level-return-rate-rollup.md)
- [Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%), administrative (3%), and overall (15%) thresholds, and project the calendar date of breach using the analytics_events trend.](/queries/nacha-threshold-breach-trend-projection.md)
- [Trace repeat R05/R10/R11/R29 unauthorized-debit returns for a given originator back to a specific origination channel by cross-referencing settlement_records and clearing_batches in FIS Payments Hub for missing prenote or WEB debit authorization controls.](/queries/root-cause-attribution-validation-control-diagnosis.md)
- [Publish the originator return-rate scorecard to Looker dashboards, notify the relationship owner with the projected breach date and recommended validation-control fix, and execute the publish action in FIS Payments Hub with a full audit trail.](/queries/relationship-owner-notification-scorecard-publication.md)
