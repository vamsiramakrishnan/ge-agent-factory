---
type: Query Capability
title: "Predict failure likelihood based on device age, model failure history, usage ..."
description: "Predict failure likelihood based on device age, model failure history, usage intensity, and hardware diagnostics. Identify devices approaching warranty expiry."
source_id: "failure-risk-modeling"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Predict failure likelihood based on device age, model failure history, usage intensity, and hardware diagnostics. Identify devices approaching warranty expiry.

## Tools used

- [lookup_device_lifecycle_manager_runbook](/tools/lookup-device-lifecycle-manager-runbook.md)

## Runs in

- [failure_risk_modeling](/workflow/failure-risk-modeling.md)

## Evidence expected

- document_reference

## Evals

- [Run the Device Lifecycle Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/device-lifecycle-manager-end-to-end.md)

# Citations

- [Device Lifecycle Manager Operations Runbook](/documents/device-lifecycle-manager-runbook.md)
