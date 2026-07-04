---
type: Eval Scenario
title: "Run the Mid-Term Cancellation Retention Agent workflow for the current period..."
description: "Run the Mid-Term Cancellation Retention Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "midterm-cancellation-retention-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Mid-Term Cancellation Retention Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cancellation-signal-intake](/queries/cancellation-signal-intake.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)

## Success rubric

Action generate executed against Guidewire PolicyCenter, with audit-trail entry and Retention Specialist notified of outcomes.

# Citations

- [Mid-Term Cancellation Retention Agent Authority & Referral Guide](/documents/midterm-cancellation-retention-agent-authority-guide.md)
