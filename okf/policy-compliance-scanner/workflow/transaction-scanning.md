---
type: Workflow Stage
title: Transaction Scanning
description: Scan all transactions against extracted policy rules. Flag deviations and calculate compliance scores by department and policy area.
source_id: transaction_scanning
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transaction Scanning

Scan all transactions against extracted policy rules. Flag deviations and calculate compliance scores by department and policy area.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

Next: [Report Generation](/workflow/report-generation.md)
