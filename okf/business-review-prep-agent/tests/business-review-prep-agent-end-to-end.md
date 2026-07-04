---
type: Eval Scenario
title: Run the Business Review Prep Agent workflow for the current period. Cite the ...
description: "Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "business-review-prep-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [qbr-data-assembly](/queries/qbr-data-assembly.md)

## Mechanisms to call

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_market_intelligence_market_intelligence_records](/tools/query-market-intelligence-market-intelligence-records.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

## Success rubric

Action generate executed against Scorecard Data, with audit-trail entry and Supplier Relationship Manager notified of outcomes.

# Citations

- [Business Review Prep Agent Procurement Policy Guide](/documents/business-review-prep-agent-policy-guide.md)
