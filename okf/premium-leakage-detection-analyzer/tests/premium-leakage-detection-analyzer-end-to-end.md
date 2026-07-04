---
type: Eval Scenario
title: Run the Premium Leakage Detection Analyzer workflow for the current period. C...
description: "Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "premium-leakage-detection-analyzer-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Premium Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [recovery-publication-audit-trail](/queries/recovery-publication-audit-trail.md)

## Mechanisms to call

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)
- [action_lexisnexis_risk_solutions_publish](/tools/action-lexisnexis-risk-solutions-publish.md)

## Success rubric

Action publish executed against LexisNexis Risk Solutions, with audit-trail entry and Premium Audit Manager notified of outcomes.

# Citations

- [Premium Leakage Detection Analyzer Authority & Referral Guide](/documents/premium-leakage-detection-analyzer-authority-guide.md)
