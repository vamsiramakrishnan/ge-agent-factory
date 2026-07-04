---
type: Workflow Stage
title: Transaction Extraction
description: "Extract AP transactions from SAP and Coupa. Map against policy rules for approval thresholds, procurement method requirements, and vendor limits."
source_id: transaction_extraction
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transaction Extraction

Extract AP transactions from SAP and Coupa. Map against policy rules for approval thresholds, procurement method requirements, and vendor limits.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_ap_policy_compliance_monitor_controls_playbook](/tools/lookup-ap-policy-compliance-monitor-controls-playbook.md)

Next: [Rule-Based Compliance & Trends](/workflow/rule-based-compliance-trends.md)
