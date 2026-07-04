---
type: Query Capability
title: "Identify relevant peer group based on industry, size, geography, and business..."
description: "Identify relevant peer group based on industry, size, geography, and business model. Pull latest financial data from Capital IQ and Bloomberg."
source_id: "peer-group-construction"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Identify relevant peer group based on industry, size, geography, and business model. Pull latest financial data from Capital IQ and Bloomberg.

## Tools used

- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [lookup_peer_benchmarking_agent_controls_playbook](/tools/lookup-peer-benchmarking-agent-controls-playbook.md)

## Runs in

- [peer_group_construction](/workflow/peer-group-construction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Peer Benchmarking Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/peer-benchmarking-agent-end-to-end.md)

# Citations

- [Peer Benchmarking Agent Controls Playbook](/documents/peer-benchmarking-agent-controls-playbook.md)
