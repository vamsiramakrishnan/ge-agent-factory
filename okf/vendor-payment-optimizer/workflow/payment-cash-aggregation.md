---
type: Workflow Stage
title: "Payment & Cash Aggregation"
description: "Pull all pending payments from SAP payment run (F110), current cash positions from Kyriba, and dynamic discounting opportunities from Taulia."
source_id: payment_cash_aggregation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Payment & Cash Aggregation

Pull all pending payments from SAP payment run (F110), current cash positions from Kyriba, and dynamic discounting opportunities from Taulia.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

Next: [Working Capital Optimization](/workflow/working-capital-optimization.md)
