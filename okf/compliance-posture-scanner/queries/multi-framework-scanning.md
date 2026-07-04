---
type: Query Capability
title: "Execute compliance checks against CIS benchmarks, SOC 2 CC controls, and ISO ..."
description: "Execute compliance checks against CIS benchmarks, SOC 2 CC controls, and ISO 27001 requirements across cloud and endpoint environments."
source_id: "multi-framework-scanning"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute compliance checks against CIS benchmarks, SOC 2 CC controls, and ISO 27001 requirements across cloud and endpoint environments.

## Tools used

- [query_qualys_scan_findings](/tools/query-qualys-scan-findings.md)
- [query_crowdstrike_scan_findings](/tools/query-crowdstrike-scan-findings.md)
- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)

## Runs in

- [multi_framework_scanning](/workflow/multi-framework-scanning.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

# Citations

- [Compliance Posture Scanner Operations Runbook](/documents/compliance-posture-scanner-runbook.md)
