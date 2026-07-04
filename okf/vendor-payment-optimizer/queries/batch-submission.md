---
type: Query Capability
title: Submit optimized payment batch to SAP for execution after Treasury approval. ...
description: Submit optimized payment batch to SAP for execution after Treasury approval. Record discount capture and DPO metrics.
source_id: "batch-submission"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Submit optimized payment batch to SAP for execution after Treasury approval. Record discount capture and DPO metrics.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_vendor_payment_optimizer_controls_playbook](/tools/lookup-vendor-payment-optimizer-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Runs in

- [batch_submission](/workflow/batch-submission.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Vendor Payment Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-payment-optimizer-end-to-end.md)

# Citations

- [Vendor Payment Optimizer Controls Playbook](/documents/vendor-payment-optimizer-controls-playbook.md)
