---
type: Query Capability
title: "Parse the auditor's evidence request — often written in audit language. Map t..."
description: "Parse the auditor's evidence request — often written in audit language. Map to specific internal systems, data types, and time periods. Identify which controls the request relates to."
source_id: "request-interpretation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Parse the auditor's evidence request — often written in audit language. Map to specific internal systems, data types, and time periods. Identify which controls the request relates to.

## Tools used

- [lookup_audit_evidence_collector_runbook](/tools/lookup-audit-evidence-collector-runbook.md)

## Runs in

- [request_interpretation](/workflow/request-interpretation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-evidence-collector-end-to-end.md)

# Citations

- [Audit Evidence Collector Operations Runbook](/documents/audit-evidence-collector-runbook.md)
