---
type: Query Capability
title: Compare findings against prior audits for recurrence patterns. Score severity...
description: Compare findings against prior audits for recurrence patterns. Score severity using impact and likelihood dimensions. Benchmark against industry standards.
source_id: "trend-severity-analysis"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compare findings against prior audits for recurrence patterns. Score severity using impact and likelihood dimensions. Benchmark against industry standards.

## Tools used

- [lookup_audit_report_generator_controls_playbook](/tools/lookup-audit-report-generator-controls-playbook.md)

## Runs in

- [trend_severity_analysis](/workflow/trend-severity-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the Audit Report Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-report-generator-end-to-end.md)

# Citations

- [Audit Report Generator Controls Playbook](/documents/audit-report-generator-controls-playbook.md)
