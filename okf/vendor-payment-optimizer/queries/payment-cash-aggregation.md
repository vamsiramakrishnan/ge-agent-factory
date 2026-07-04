---
type: Query Capability
title: "Pull all pending payments from SAP payment run (F110), current cash positions..."
description: "Pull all pending payments from SAP payment run (F110), current cash positions from Kyriba, and dynamic discounting opportunities from Taulia."
source_id: "payment-cash-aggregation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull all pending payments from SAP payment run (F110), current cash positions from Kyriba, and dynamic discounting opportunities from Taulia.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Runs in

- [payment_cash_aggregation](/workflow/payment-cash-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-payment-optimizer-end-to-end.md)

# Citations

- [Vendor Payment Optimizer Controls Playbook](/documents/vendor-payment-optimizer-controls-playbook.md)
