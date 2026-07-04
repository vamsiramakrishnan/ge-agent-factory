---
type: Query Capability
title: "Gemini provides forecast with risk explanations. 'Q2 forecast: $12.4M (82% co..."
description: "Gemini provides forecast with risk explanations. 'Q2 forecast: $12.4M (82% confidence). Risk: 3 deals worth $2.1M are single-threaded. Upside: 2 accounts showing surging intent haven't entered pipeline yet. Recommend marketing air cover for at-risk deals.'"
source_id: "confidence-risk-narrative"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini provides forecast with risk explanations. 'Q2 forecast: $12.4M (82% confidence). Risk: 3 deals worth $2.1M are single-threaded. Upside: 2 accounts showing surging intent haven't entered pipeline yet. Recommend marketing air cover for at-risk deals.'

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_predictive_pipeline_forecaster_playbook](/tools/lookup-predictive-pipeline-forecaster-playbook.md)

## Runs in

- [confidence_risk_narrative](/workflow/confidence-risk-narrative.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Predictive Pipeline Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/predictive-pipeline-forecaster-end-to-end.md)

# Citations

- [Predictive Pipeline Forecaster Playbook](/documents/predictive-pipeline-forecaster-playbook.md)
