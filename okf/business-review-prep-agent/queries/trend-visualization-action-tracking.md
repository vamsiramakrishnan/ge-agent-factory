---
type: Query Capability
title: "Generate trend visualizations on KPI trajectories, compute contract utilizati..."
description: "Generate trend visualizations on KPI trajectories, compute contract utilization metrics, and track action item aging from previous reviews."
source_id: "trend-visualization-action-tracking"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate trend visualizations on KPI trajectories, compute contract utilization metrics, and track action item aging from previous reviews.

## Tools used

- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_business_review_prep_agent_policy_guide](/tools/lookup-business-review-prep-agent-policy-guide.md)
- [action_scorecard_data_generate](/tools/action-scorecard-data-generate.md)

## Runs in

- [trend_visualization_action_tracking](/workflow/trend-visualization-action-tracking.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Business Review Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/business-review-prep-agent-end-to-end.md)

# Citations

- [Business Review Prep Agent Procurement Policy Guide](/documents/business-review-prep-agent-policy-guide.md)
