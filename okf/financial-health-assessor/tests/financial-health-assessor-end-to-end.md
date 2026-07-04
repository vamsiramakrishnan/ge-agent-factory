---
type: Eval Scenario
title: Run the Financial Health Assessor workflow for the current period. Cite the r...
description: "Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "financial-health-assessor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [financial-data-aggregation](/queries/financial-data-aggregation.md)

## Mechanisms to call

- [query_rapidratings_rapidratings_records](/tools/query-rapidratings-rapidratings-records.md)
- [query_d_b_d_b_records](/tools/query-d-b-d-b-records.md)
- [query_moody_s_moody_s_records](/tools/query-moody-s-moody-s-records.md)
- [query_sec_edgar_sec_edgar_records](/tools/query-sec-edgar-sec-edgar-records.md)
- [lookup_financial_health_assessor_policy_guide](/tools/lookup-financial-health-assessor-policy-guide.md)

## Success rubric

Supplier Risk Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Financial Health Assessor Procurement Policy Guide](/documents/financial-health-assessor-policy-guide.md)
