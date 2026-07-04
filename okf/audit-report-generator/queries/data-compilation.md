---
type: Query Capability
title: "Extract all findings, supporting evidence, severity ratings, and management r..."
description: "Extract all findings, supporting evidence, severity ratings, and management remediation responses from AuditBoard. Pull prior year comparisons."
source_id: "data-compilation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract all findings, supporting evidence, severity ratings, and management remediation responses from AuditBoard. Pull prior year comparisons.

## Tools used

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)
- [action_auditboard_recommend](/tools/action-auditboard-recommend.md)

## Runs in

- [data_compilation](/workflow/data-compilation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-report-generator-end-to-end.md)

# Citations

- [Audit Report Generator Controls Playbook](/documents/audit-report-generator-controls-playbook.md)
