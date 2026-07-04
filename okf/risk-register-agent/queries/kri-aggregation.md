---
type: Query Capability
title: "Collect Key Risk Indicators from across IT operations: vulnerability counts, ..."
description: "Collect Key Risk Indicators from across IT operations: vulnerability counts, incident rates, compliance scores, cloud spend variance, access review completion rates. Compare against thresholds."
source_id: "kri-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect Key Risk Indicators from across IT operations: vulnerability counts, incident rates, compliance scores, cloud spend variance, access review completion rates. Compare against thresholds.

## Tools used

- [lookup_risk_register_agent_runbook](/tools/lookup-risk-register-agent-runbook.md)

## Runs in

- [kri_aggregation](/workflow/kri-aggregation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Risk Register Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/risk-register-agent-end-to-end.md)

# Citations

- [Risk Register Agent Operations Runbook](/documents/risk-register-agent-runbook.md)
