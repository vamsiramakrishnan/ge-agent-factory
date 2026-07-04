---
type: Eval Scenario
title: Our Salesforce data for May had a sync error and we lost 40% of the opportuni...
description: "Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?"
source_id: "low-confidence-attribution-refusal"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Our Salesforce data for May had a sync error and we lost 40% of the opportunity records. Can you still generate this month's ROI narrative?

## Validates

- [cost-revenue-matching](/queries/cost-revenue-matching.md)

## Mechanisms to call

- [query_bigquery_attribution_results](/tools/query-bigquery-attribution-results.md)

## Success rubric

Refuse to publish; escalate to MarTech ops with specific data quality issues flagged (missing 40% of records, cannot meet minimum confidence threshold).

# Citations

- [Attribution Methodology Handbook](/documents/attribution-methodology-handbook.md)
