---
type: Query Capability
title: Format brief for stakeholder distribution via Google Workspace. Track readers...
description: Format brief for stakeholder distribution via Google Workspace. Track readership and feedback. Maintain searchable research archive in BigQuery.
source_id: distribution
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Format brief for stakeholder distribution via Google Workspace. Track readership and feedback. Maintain searchable research archive in BigQuery.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_research_synthesizer_playbook](/tools/lookup-market-research-synthesizer-playbook.md)
- [action_gartner_archive](/tools/action-gartner-archive.md)

## Runs in

- [distribution](/workflow/distribution.md)

## Evidence expected

- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Market Research Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-research-synthesizer-end-to-end.md)

# Citations

- [Market Research Synthesizer Playbook](/documents/market-research-synthesizer-playbook.md)
