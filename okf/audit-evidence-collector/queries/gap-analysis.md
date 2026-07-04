---
type: Query Capability
title: Analyze collected evidence for completeness against the audit request. Identi...
description: "Analyze collected evidence for completeness against the audit request. Identify missing artifacts, stale documents, and weak evidence that may not satisfy the auditor."
source_id: "gap-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze collected evidence for completeness against the audit request. Identify missing artifacts, stale documents, and weak evidence that may not satisfy the auditor.

## Tools used

- [query_google_drive_documents](/tools/query-google-drive-documents.md)
- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

## Runs in

- [gap_analysis](/workflow/gap-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-evidence-collector-end-to-end.md)

# Citations

- [Audit Evidence Collector Operations Runbook](/documents/audit-evidence-collector-runbook.md)
