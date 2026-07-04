---
type: Workflow Stage
title: QBR Data Assembly
description: "Pull scorecard data, open action items from previous 3 QBRs, contract performance metrics, and current market conditions. Aggregate into a unified review context."
source_id: qbr_data_assembly
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# QBR Data Assembly

Pull scorecard data, open action items from previous 3 QBRs, contract performance metrics, and current market conditions. Aggregate into a unified review context.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_scorecard_data_scorecard_data_records](/tools/query-scorecard-data-scorecard-data-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_market_intelligence_market_intelligence_records](/tools/query-market-intelligence-market-intelligence-records.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

Next: [Trend Visualization & Action Tracking](/workflow/trend-visualization-action-tracking.md)
