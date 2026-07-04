---
type: Workflow Stage
title: Compliance Narrative Generation
description: "Gemini generates audit-ready compliance narrative explaining posture, gaps, and remediation priorities in business terms. Maps findings to specific framework requirements."
source_id: compliance_narrative_generation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compliance Narrative Generation

Gemini generates audit-ready compliance narrative explaining posture, gaps, and remediation priorities in business terms. Maps findings to specific framework requirements.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)
- [action_qualys_generate](/tools/action-qualys-generate.md)

Next: [Evidence Collection & Distribution](/workflow/evidence-collection-distribution.md)
