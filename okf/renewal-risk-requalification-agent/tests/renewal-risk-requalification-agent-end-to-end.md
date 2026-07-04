---
type: Eval Scenario
title: Run the Renewal Risk Requalification Agent workflow for the current period. C...
description: "Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "renewal-risk-requalification-agent-end-to-end"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Renewal Risk Requalification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [route-audit-to-underwriter-queue](/queries/route-audit-to-underwriter-queue.md)

## Mechanisms to call

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_renewal_risk_requalification_agent_authority_guide](/tools/lookup-renewal-risk-requalification-agent-authority-guide.md)
- [action_guidewire_policycenter_route](/tools/action-guidewire-policycenter-route.md)

## Success rubric

Action route executed against Guidewire PolicyCenter, with audit-trail entry and Underwriter notified of outcomes.

# Citations

- [Renewal Risk Requalification Agent Authority & Referral Guide](/documents/renewal-risk-requalification-agent-authority-guide.md)
