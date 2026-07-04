---
type: Query Capability
title: "Gemini reads internal signals: 'Sales closed a $5M deal with 50% upfront paym..."
description: "Gemini reads internal signals: 'Sales closed a $5M deal with 50% upfront payment -- adjust next week's inflows. Supply chain flagged a $2M expedite fee -- add to next month's outflows.' Adjusts forecast with narrative explanation."
source_id: "qualitative-signal-integration"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads internal signals: 'Sales closed a $5M deal with 50% upfront payment -- adjust next week's inflows. Supply chain flagged a $2M expedite fee -- add to next month's outflows.' Adjusts forecast with narrative explanation.

## Tools used

- [lookup_cash_flow_forecaster_controls_playbook](/tools/lookup-cash-flow-forecaster-controls-playbook.md)

## Runs in

- [qualitative_signal_integration](/workflow/qualitative-signal-integration.md)

## Evidence expected

- document_reference

## Evals

- [Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cash-flow-forecaster-end-to-end.md)

# Citations

- [Cash Flow Forecaster Controls Playbook](/documents/cash-flow-forecaster-controls-playbook.md)
