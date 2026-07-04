---
type: Query Capability
title: "Pull scorecard data, open action items from previous 3 QBRs, contract perform..."
description: "Pull scorecard data, open action items from previous 3 QBRs, contract performance metrics, and current market conditions. Aggregate into a unified review context."
source_id: "qbr-data-assembly"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull scorecard data, open action items from previous 3 QBRs, contract performance metrics, and current market conditions. Aggregate into a unified review context.

## Tools used

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_market_intelligence_market_intelligence_records](/tools/query-market-intelligence-market-intelligence-records.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

## Runs in

- [qbr_data_assembly](/workflow/qbr-data-assembly.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/business-review-prep-agent-end-to-end.md)

# Citations

- [Business Review Prep Agent Procurement Policy Guide](/documents/business-review-prep-agent-policy-guide.md)
