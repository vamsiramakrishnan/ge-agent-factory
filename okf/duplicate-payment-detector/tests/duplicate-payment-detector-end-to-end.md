---
type: Eval Scenario
title: Run the Duplicate Payment Detector workflow for the current period. Cite the ...
description: "Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "duplicate-payment-detector-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Duplicate Payment Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [pre-payment-scan](/queries/pre-payment-scan.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_duplicate_payment_detector_policy_guide](/tools/lookup-duplicate-payment-detector-policy-guide.md)
- [action_sap_s_4hana_fi_submit](/tools/action-sap-s-4hana-fi-submit.md)

## Success rubric

Action submit executed against SAP S/4HANA FI, with audit-trail entry and AP Manager notified of outcomes.

# Citations

- [Duplicate Payment Detector Procurement Policy Guide](/documents/duplicate-payment-detector-policy-guide.md)
