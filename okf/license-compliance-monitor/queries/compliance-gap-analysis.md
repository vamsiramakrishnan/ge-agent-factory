---
type: Query Capability
title: "Identify over-licensed products (wasted spend), under-licensed products (audi..."
description: "Identify over-licensed products (wasted spend), under-licensed products (audit risk), and unused licenses (reclaim opportunity). Score audit risk by vendor based on enforcement history."
source_id: "compliance-gap-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify over-licensed products (wasted spend), under-licensed products (audit risk), and unused licenses (reclaim opportunity). Score audit risk by vendor based on enforcement history.

## Tools used

- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

## Runs in

- [compliance_gap_analysis](/workflow/compliance-gap-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the License Compliance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/license-compliance-monitor-end-to-end.md)

# Citations

- [License Compliance Monitor Operations Runbook](/documents/license-compliance-monitor-runbook.md)
