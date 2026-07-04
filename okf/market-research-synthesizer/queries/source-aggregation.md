---
type: Query Capability
title: "Ingest analyst reports from Gartner and Forrester, user reviews from G2, mark..."
description: "Ingest analyst reports from Gartner and Forrester, user reviews from G2, market data feeds, and competitive intelligence. Structure for cross-source analysis."
source_id: "source-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest analyst reports from Gartner and Forrester, user reviews from G2, market data feeds, and competitive intelligence. Structure for cross-source analysis.

## Tools used

- [query_gartner_gartner_records](/tools/query-gartner-gartner-records.md)
- [query_forrester_forrester_records](/tools/query-forrester-forrester-records.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_market_research_synthesizer_playbook](/tools/lookup-market-research-synthesizer-playbook.md)
- [action_gartner_archive](/tools/action-gartner-archive.md)

## Runs in

- [source_aggregation](/workflow/source-aggregation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-research-synthesizer-end-to-end.md)

# Citations

- [Market Research Synthesizer Playbook](/documents/market-research-synthesizer-playbook.md)
