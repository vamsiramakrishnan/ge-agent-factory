---
type: Query Capability
title: "Score each regulatory change for relevance based on company's entity structur..."
description: "Score each regulatory change for relevance based on company's entity structure, jurisdictions, and transaction types. Classify impact as high (requires action), medium (requires monitoring), or low (informational)."
source_id: "relevance-impact-scoring"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Score each regulatory change for relevance based on company's entity structure, jurisdictions, and transaction types. Classify impact as high (requires action), medium (requires monitoring), or low (informational).

## Tools used

- [lookup_regulatory_change_monitor_controls_playbook](/tools/lookup-regulatory-change-monitor-controls-playbook.md)

## Runs in

- [relevance_impact_scoring](/workflow/relevance-impact-scoring.md)

## Evidence expected

- document_reference

## Evals

- [Run the Regulatory Change Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-change-monitor-end-to-end.md)

# Citations

- [Regulatory Change Monitor Controls Playbook](/documents/regulatory-change-monitor-controls-playbook.md)
