---
type: Proof Obligation
title: "Golden eval obligation — Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-business-review-prep-agent-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [business-review-prep-agent-end-to-end](/tests/business-review-prep-agent-end-to-end.md)


## Mechanisms

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_market_intelligence_market_intelligence_records](/tools/query-market-intelligence-market-intelligence-records.md)
- [query_google_slides_presentations](/tools/query-google-slides-presentations.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

## Entities that must be referenced

- scorecard_data_records
- contract_data_records
- market_intelligence_records
- presentations

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [business-review-prep-agent-policy-guide](/documents/business-review-prep-agent-policy-guide.md)
