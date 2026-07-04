---
type: Eval Scenario
title: Run the Policy Compliance Scanner workflow for the current period. Cite the r...
description: "Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "policy-compliance-scanner-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [policy-extraction](/queries/policy-extraction.md)

## Mechanisms to call

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

## Success rubric

Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Policy Compliance Scanner Controls Playbook](/documents/policy-compliance-scanner-controls-playbook.md)
