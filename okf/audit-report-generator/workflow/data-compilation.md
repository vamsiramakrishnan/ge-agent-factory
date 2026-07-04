---
type: Workflow Stage
title: Data Compilation
description: "Extract all findings, supporting evidence, severity ratings, and management remediation responses from AuditBoard. Pull prior year comparisons."
source_id: data_compilation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Compilation

Extract all findings, supporting evidence, severity ratings, and management remediation responses from AuditBoard. Pull prior year comparisons.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)
- [action_auditboard_recommend](/tools/action-auditboard-recommend.md)

Next: [Trend & Severity Analysis](/workflow/trend-severity-analysis.md)
