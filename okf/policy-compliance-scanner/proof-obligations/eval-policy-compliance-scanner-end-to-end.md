---
type: Proof Obligation
title: "Golden eval obligation — Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-policy-compliance-scanner-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Policy Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [policy-compliance-scanner-end-to-end](/tests/policy-compliance-scanner-end-to-end.md)


## Mechanisms

- [query_sharepoint_google_drive_documents](/tools/query-sharepoint-google-drive-documents.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policy_compliance_scanner_controls_playbook](/tools/lookup-policy-compliance-scanner-controls-playbook.md)

## Entities that must be referenced

- documents
- transactions
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [policy-compliance-scanner-controls-playbook](/documents/policy-compliance-scanner-controls-playbook.md)
