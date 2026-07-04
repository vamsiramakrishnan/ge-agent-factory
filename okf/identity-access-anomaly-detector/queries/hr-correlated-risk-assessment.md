---
type: Query Capability
title: "Gemini cross-references anomalies with HR events (terminations, role changes,..."
description: "Gemini cross-references anomalies with HR events (terminations, role changes, contractor end dates). Generates risk narrative explaining whether anomaly is benign or requires investigation."
source_id: "hr-correlated-risk-assessment"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini cross-references anomalies with HR events (terminations, role changes, contractor end dates). Generates risk narrative explaining whether anomaly is benign or requires investigation.

## Tools used

- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

## Runs in

- [hr_correlated_risk_assessment](/workflow/hr-correlated-risk-assessment.md)

## Evidence expected

- document_reference

## Evals

- [Run the Identity & Access Anomaly Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/identity-access-anomaly-detector-end-to-end.md)

# Citations

- [Identity & Access Anomaly Detector Operations Runbook](/documents/identity-access-anomaly-detector-runbook.md)
