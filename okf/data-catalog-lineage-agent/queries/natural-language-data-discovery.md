---
type: Query Capability
title: "Gemini answers data discovery questions in natural language — 'the canonical ..."
description: "Gemini answers data discovery questions in natural language — 'the canonical source for customer revenue is dwh.dim_customer joined with fact_orders.' Warns against using staging tables directly."
source_id: "natural-language-data-discovery"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini answers data discovery questions in natural language — 'the canonical source for customer revenue is dwh.dim_customer joined with fact_orders.' Warns against using staging tables directly.

## Tools used

- [lookup_data_catalog_lineage_agent_runbook](/tools/lookup-data-catalog-lineage-agent-runbook.md)

## Runs in

- [natural_language_data_discovery](/workflow/natural-language-data-discovery.md)

## Evidence expected

- document_reference

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

# Citations

- [Data Catalog & Lineage Agent Operations Runbook](/documents/data-catalog-lineage-agent-runbook.md)
