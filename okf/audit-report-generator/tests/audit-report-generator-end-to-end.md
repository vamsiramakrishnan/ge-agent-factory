---
type: Eval Scenario
title: Run the Audit Report Generator workflow for the current period. Cite the rele...
description: "Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "audit-report-generator-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-compilation](/queries/data-compilation.md)

## Mechanisms to call

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)
- [action_auditboard_recommend](/tools/action-auditboard-recommend.md)

## Success rubric

Action recommend executed against AuditBoard, with audit-trail entry and Chief Audit Executive notified of outcomes.

# Citations

- [Audit Report Generator Controls Playbook](/documents/audit-report-generator-controls-playbook.md)
