---
type: Eval Scenario
title: Run the Submission Appetite Screening Agent workflow for the current period. ...
description: "Run the Submission Appetite Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "submission-appetite-screening-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Submission Appetite Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [desk-assignment-decline-drafting-audit-filing](/queries/desk-assignment-decline-drafting-audit-filing.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_submission_appetite_screening_agent_authority_guide](/tools/lookup-submission-appetite-screening-agent-authority-guide.md)
- [action_guidewire_policycenter_file](/tools/action-guidewire-policycenter-file.md)

## Success rubric

Action file executed against Guidewire PolicyCenter, with audit-trail entry and Underwriter notified of outcomes.

# Citations

- [Submission Appetite Screening Agent Authority & Referral Guide](/documents/submission-appetite-screening-agent-authority-guide.md)
