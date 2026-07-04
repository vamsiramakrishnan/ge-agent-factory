---
type: Query Capability
title: "Gemini generates audit-ready compliance narrative explaining posture, gaps, a..."
description: "Gemini generates audit-ready compliance narrative explaining posture, gaps, and remediation priorities in business terms. Maps findings to specific framework requirements."
source_id: "compliance-narrative-generation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates audit-ready compliance narrative explaining posture, gaps, and remediation priorities in business terms. Maps findings to specific framework requirements.

## Tools used

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)
- [action_qualys_generate](/tools/action-qualys-generate.md)

## Runs in

- [compliance_narrative_generation](/workflow/compliance-narrative-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

# Citations

- [Compliance Posture Scanner Operations Runbook](/documents/compliance-posture-scanner-runbook.md)
