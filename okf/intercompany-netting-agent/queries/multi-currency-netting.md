---
type: Query Capability
title: Optimize netting to minimize the number of settlements and FX conversion cost...
description: Optimize netting to minimize the number of settlements and FX conversion costs. Sequence settlements to reduce peak funding requirements. Calculate net positions after offsetting across the entity network.
source_id: "multi-currency-netting"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Optimize netting to minimize the number of settlements and FX conversion costs. Sequence settlements to reduce peak funding requirements. Calculate net positions after offsetting across the entity network.

## Tools used

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

## Runs in

- [multi_currency_netting](/workflow/multi-currency-netting.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/intercompany-netting-agent-end-to-end.md)

# Citations

- [Intercompany Netting Agent Controls Playbook](/documents/intercompany-netting-agent-controls-playbook.md)
