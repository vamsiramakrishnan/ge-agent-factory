---
type: Query Capability
title: Extract AP transactions from SAP and Coupa. Map against policy rules for appr...
description: "Extract AP transactions from SAP and Coupa. Map against policy rules for approval thresholds, procurement method requirements, and vendor limits."
source_id: "transaction-extraction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract AP transactions from SAP and Coupa. Map against policy rules for approval thresholds, procurement method requirements, and vendor limits.

## Tools used

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_ap_policy_compliance_monitor_controls_playbook](/tools/lookup-ap-policy-compliance-monitor-controls-playbook.md)

## Runs in

- [transaction_extraction](/workflow/transaction-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the AP Policy Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ap-policy-compliance-monitor-end-to-end.md)

# Citations

- [AP Policy Compliance Monitor Controls Playbook](/documents/ap-policy-compliance-monitor-controls-playbook.md)
