---
type: Query Capability
title: Score each risk using likelihood x impact matrix with control effectiveness w...
description: Score each risk using likelihood x impact matrix with control effectiveness weighting. Calculate residual risk after treatment effectiveness. Detect risks trending toward threshold breach.
source_id: "risk-scoring"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score each risk using likelihood x impact matrix with control effectiveness weighting. Calculate residual risk after treatment effectiveness. Detect risks trending toward threshold breach.

## Tools used

- [lookup_risk_register_agent_runbook](/tools/lookup-risk-register-agent-runbook.md)

## Runs in

- [risk_scoring](/workflow/risk-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/risk-register-agent-end-to-end.md)

# Citations

- [Risk Register Agent Operations Runbook](/documents/risk-register-agent-runbook.md)
