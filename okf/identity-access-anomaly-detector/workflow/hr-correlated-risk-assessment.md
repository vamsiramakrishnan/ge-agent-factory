---
type: Workflow Stage
title: "HR-Correlated Risk Assessment"
description: "Gemini cross-references anomalies with HR events (terminations, role changes, contractor end dates). Generates risk narrative explaining whether anomaly is benign or requires investigation."
source_id: hr_correlated_risk_assessment
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# HR-Correlated Risk Assessment

Gemini cross-references anomalies with HR events (terminations, role changes, contractor end dates). Generates risk narrative explaining whether anomaly is benign or requires investigation.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [lookup_identity_access_anomaly_detector_runbook](/tools/lookup-identity-access-anomaly-detector-runbook.md)

Next: [Revocation & Audit](/workflow/revocation-audit.md)
