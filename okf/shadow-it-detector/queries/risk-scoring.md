---
type: Query Capability
title: "Score each shadow app by data access scope (Calendar, Drive, email), user ado..."
description: "Score each shadow app by data access scope (Calendar, Drive, email), user adoption count, data sensitivity exposure, compliance implications, and vendor security posture."
source_id: "risk-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score each shadow app by data access scope (Calendar, Drive, email), user adoption count, data sensitivity exposure, compliance implications, and vendor security posture.

## Tools used

- [lookup_shadow_it_detector_runbook](/tools/lookup-shadow-it-detector-runbook.md)

## Runs in

- [risk_scoring](/workflow/risk-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Shadow IT Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/shadow-it-detector-end-to-end.md)

# Citations

- [Shadow IT Detector Operations Runbook](/documents/shadow-it-detector-runbook.md)
