---
type: Query Capability
title: "Classify violations by severity (critical/high/medium/low), type (boundary cr..."
description: "Classify violations by severity (critical/high/medium/low), type (boundary crossing, pattern violation, naming), and scope (single service vs. systemic). Score drift from architecture standards."
source_id: "violation-classification"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify violations by severity (critical/high/medium/low), type (boundary crossing, pattern violation, naming), and scope (single service vs. systemic). Score drift from architecture standards.

## Tools used

- [lookup_architecture_compliance_scanner_runbook](/tools/lookup-architecture-compliance-scanner-runbook.md)

## Runs in

- [violation_classification](/workflow/violation-classification.md)

## Evidence expected

- document_reference

## Evals

- [Run the Architecture Compliance Scanner workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/architecture-compliance-scanner-end-to-end.md)

# Citations

- [Architecture Compliance Scanner Operations Runbook](/documents/architecture-compliance-scanner-runbook.md)
