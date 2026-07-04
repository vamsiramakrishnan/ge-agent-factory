---
type: Query Capability
title: "Score control effectiveness based on finding severity, recurrence, and remedi..."
description: "Score control effectiveness based on finding severity, recurrence, and remediation velocity. Detect compliance drift from previous baselines."
source_id: "control-effectiveness-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score control effectiveness based on finding severity, recurrence, and remediation velocity. Detect compliance drift from previous baselines.

## Tools used

- [lookup_compliance_posture_scanner_runbook](/tools/lookup-compliance-posture-scanner-runbook.md)

## Runs in

- [control_effectiveness_scoring](/workflow/control-effectiveness-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Compliance Posture Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-posture-scanner-end-to-end.md)

# Citations

- [Compliance Posture Scanner Operations Runbook](/documents/compliance-posture-scanner-runbook.md)
