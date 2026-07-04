---
type: Query Capability
title: "Gemini generates explanatory commentary for dashboard insights: 'Cycle time i..."
description: "Gemini generates explanatory commentary for dashboard insights: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown.' Identifies patterns in negotiation outcomes: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.'"
source_id: "narrative-commentary"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates explanatory commentary for dashboard insights: 'Cycle time increased 40% driven by 3 board-approval deals, not systemic slowdown.' Identifies patterns in negotiation outcomes: 'Suppliers consistently push back on IP ownership in professional services — pre-negotiate standard IP framework.'

## Tools used

- [lookup_contract_analytics_dashboard_policy_guide](/tools/lookup-contract-analytics-dashboard-policy-guide.md)
- [action_icertis_analytics_generate](/tools/action-icertis-analytics-generate.md)

## Runs in

- [narrative_commentary](/workflow/narrative-commentary.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/contract-analytics-dashboard-end-to-end.md)

# Citations

- [Contract Analytics Dashboard Procurement Policy Guide](/documents/contract-analytics-dashboard-policy-guide.md)
