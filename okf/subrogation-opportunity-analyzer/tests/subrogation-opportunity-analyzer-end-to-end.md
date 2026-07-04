---
type: Eval Scenario
title: Run the Subrogation Opportunity Analyzer workflow for the current period. Cit...
description: "Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "subrogation-opportunity-analyzer-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Subrogation Opportunity Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_subrogation_opportunity_analyzer_authority_guide](/tools/lookup-subrogation-opportunity-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_close](/tools/action-guidewire-claimcenter-close.md)

## Success rubric

Action close executed against Guidewire ClaimCenter, with audit-trail entry and Subrogation Specialist notified of outcomes.

# Citations

- [Subrogation Opportunity Analyzer Authority & Referral Guide](/documents/subrogation-opportunity-analyzer-authority-guide.md)
