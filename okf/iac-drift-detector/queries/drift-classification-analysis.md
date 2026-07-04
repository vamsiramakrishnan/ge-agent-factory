---
type: Query Capability
title: "Classify drift patterns (security group, IAM, compute config). Detect recurre..."
description: "Classify drift patterns (security group, IAM, compute config). Detect recurrence by comparing against historical drift data. Estimate blast radius of unmanaged changes."
source_id: "drift-classification-analysis"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Classify drift patterns (security group, IAM, compute config). Detect recurrence by comparing against historical drift data. Estimate blast radius of unmanaged changes.

## Tools used

- [lookup_iac_drift_detector_runbook](/tools/lookup-iac-drift-detector-runbook.md)

## Runs in

- [drift_classification_analysis](/workflow/drift-classification-analysis.md)

## Evidence expected

- document_reference

## Evals

- [Run the IaC Drift Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/iac-drift-detector-end-to-end.md)

# Citations

- [IaC Drift Detector Operations Runbook](/documents/iac-drift-detector-runbook.md)
