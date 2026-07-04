---
type: Query Capability
title: Scan all transactions against extracted policy rules. Flag deviations and cal...
description: Scan all transactions against extracted policy rules. Flag deviations and calculate compliance scores by department and policy area.
source_id: "transaction-scanning"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Scan all transactions against extracted policy rules. Flag deviations and calculate compliance scores by department and policy area.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

## Runs in

- [transaction_scanning](/workflow/transaction-scanning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-compliance-scanner-end-to-end.md)

# Citations

- [Policy Compliance Scanner Controls Playbook](/documents/policy-compliance-scanner-controls-playbook.md)
