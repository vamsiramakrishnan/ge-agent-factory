---
type: Eval Scenario
title: "Run the Tail Spend Classifier & Opportunity Finder workflow for the current p..."
description: "Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tail-spend-classifier-opportunity-finder-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Tail Spend Classifier & Opportunity Finder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pareto-analysis-segments-the-tail-by-transaction-distribution-ml](/queries/pareto-analysis-segments-the-tail-by-transaction-distribution-ml.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_tail_spend_classifier_opportunity_finder_policy_guide](/tools/lookup-tail-spend-classifier-opportunity-finder-policy-guide.md)
- [action_sap_s_4hana_generate](/tools/action-sap-s-4hana-generate.md)

## Success rubric

Action generate executed against SAP S/4HANA, with audit-trail entry and Indirect Procurement Lead notified of outcomes.

# Citations

- [Tail Spend Classifier & Opportunity Finder Procurement Policy Guide](/documents/tail-spend-classifier-opportunity-finder-policy-guide.md)
