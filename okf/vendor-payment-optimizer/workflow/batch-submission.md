---
type: Workflow Stage
title: Batch Submission
description: Submit optimized payment batch to SAP for execution after Treasury approval. Record discount capture and DPO metrics.
source_id: batch_submission
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Batch Submission

Submit optimized payment batch to SAP for execution after Treasury approval. Record discount capture and DPO metrics.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)
