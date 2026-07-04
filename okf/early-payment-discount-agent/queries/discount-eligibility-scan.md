---
type: Query Capability
title: Scan all open invoices in SAP for early payment discount windows. Pull dynami...
description: Scan all open invoices in SAP for early payment discount windows. Pull dynamic discounting opportunities from Taulia and C2FO marketplace.
source_id: "discount-eligibility-scan"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan all open invoices in SAP for early payment discount windows. Pull dynamic discounting opportunities from Taulia and C2FO marketplace.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_taulia_taulia_records](/tools/query-taulia-taulia-records.md)
- [query_c2fo_c2fo_records](/tools/query-c2fo-c2fo-records.md)
- [lookup_early_payment_discount_agent_controls_playbook](/tools/lookup-early-payment-discount-agent-controls-playbook.md)
- [action_sap_s_4hana_fi_recommend](/tools/action-sap-s-4hana-fi-recommend.md)

## Runs in

- [discount_eligibility_scan](/workflow/discount-eligibility-scan.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-payment-discount-agent-end-to-end.md)

# Citations

- [Early Payment Discount Agent Controls Playbook](/documents/early-payment-discount-agent-controls-playbook.md)
