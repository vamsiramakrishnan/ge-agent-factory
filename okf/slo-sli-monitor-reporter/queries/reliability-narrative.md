---
type: Query Capability
title: "Gemini generates SRE report: 'Checkout consumed 40% of monthly error budget i..."
description: "Gemini generates SRE report: 'Checkout consumed 40% of monthly error budget in week 1 due to March 12 DB incident. At current burn, budget exhausted by March 22. Recommend reliability sprint to address 3 outstanding resilience improvements.'"
source_id: "reliability-narrative"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates SRE report: 'Checkout consumed 40% of monthly error budget in week 1 due to March 12 DB incident. At current burn, budget exhausted by March 22. Recommend reliability sprint to address 3 outstanding resilience improvements.'

## Tools used

- [action_datadog_recommend](/tools/action-datadog-recommend.md)

## Runs in

- [reliability_narrative](/workflow/reliability-narrative.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the SLO/SLI Monitor & Reporter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/slo-sli-monitor-reporter-end-to-end.md)

# Citations

- [SLO/SLI Monitor & Reporter Operations Runbook](/documents/slo-sli-monitor-reporter-runbook.md)
