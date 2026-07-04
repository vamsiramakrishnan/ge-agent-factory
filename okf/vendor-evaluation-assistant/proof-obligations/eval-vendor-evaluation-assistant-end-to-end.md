---
type: Proof Obligation
title: "Golden eval obligation — Run the Vendor Evaluation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-vendor-evaluation-assistant-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Vendor Evaluation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [vendor-evaluation-assistant-end-to-end](/tests/vendor-evaluation-assistant-end-to-end.md)


## Mechanisms

- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [query_web_web_records](/tools/query-web-web-records.md)
- [lookup_vendor_evaluation_assistant_policy_handbook](/tools/lookup-vendor-evaluation-assistant-policy-handbook.md)

## Entities that must be referenced

- documents
- sheets
- web_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [vendor-evaluation-assistant-policy-handbook](/documents/vendor-evaluation-assistant-policy-handbook.md)
