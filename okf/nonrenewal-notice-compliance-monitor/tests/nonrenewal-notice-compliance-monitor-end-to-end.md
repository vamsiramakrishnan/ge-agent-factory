---
type: Eval Scenario
title: "Run the Non-Renewal Notice Compliance Monitor workflow for the current period..."
description: "Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "nonrenewal-notice-compliance-monitor-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Non-Renewal Notice Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [non-renewal-candidate-identification](/queries/non-renewal-candidate-identification.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)
- [action_guidewire_policycenter_publish](/tools/action-guidewire-policycenter-publish.md)

## Success rubric

Action publish executed against Guidewire PolicyCenter, with audit-trail entry and Compliance Officer notified of outcomes.

# Citations

- [Non-Renewal Notice Compliance Monitor Authority & Referral Guide](/documents/nonrenewal-notice-compliance-monitor-authority-guide.md)
