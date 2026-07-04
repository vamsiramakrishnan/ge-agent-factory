---
type: Proof Obligation
title: "Golden eval obligation — Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-audit-report-generator-end-to-end"
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

# Golden eval obligation — Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [audit-report-generator-end-to-end](/tests/audit-report-generator-end-to-end.md)


## Mechanisms

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)
- [action_auditboard_recommend](/tools/action-auditboard-recommend.md)

## Entities that must be referenced

- auditboard_records
- documents
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [audit-report-generator-controls-playbook](/documents/audit-report-generator-controls-playbook.md)
