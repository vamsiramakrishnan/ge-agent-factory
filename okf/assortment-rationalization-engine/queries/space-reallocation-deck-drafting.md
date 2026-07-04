---
type: Query Capability
title: "Draft the delist and space-reallocation proposal as a Looker dashboards/explo..."
description: "Draft the delist and space-reallocation proposal as a Looker dashboards/explore_queries/metric_definitions deck, attaching the evidence trail for Category Manager sign-off."
source_id: "space-reallocation-deck-drafting"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft the delist and space-reallocation proposal as a Looker dashboards/explore_queries/metric_definitions deck, attaching the evidence trail for Category Manager sign-off.

## Tools used

- [query_looker_dashboards](/tools/query-looker-dashboards.md)

## Runs in

- [space_reallocation_deck_drafting](/workflow/space-reallocation-deck-drafting.md)

## Evidence expected

- sql_result

## Evals

- [Run the Assortment Rationalization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/assortment-rationalization-engine-end-to-end.md)
- [Class 4412 (salty_snacks, merchandise_hierarchy record with gmroi_target 2.4) needs its keep/delist deck published for tomorrow. The Looker 'dashboards' record for this period reports SKU productivity at $11,950/yr, but the BigQuery cached_aggregates record for the same period and metric_name reports $9,860/yr. Which number goes in the deck, and can we route the delist proposal now?](/tests/assortment-rationalization-engine-conflicting-dashboard-baseline.md)

# Citations

- [Assortment Rationalization Engine Retail Execution Playbook](/documents/assortment-rationalization-engine-execution-playbook.md)
- [Vendor Trade-Funds, Allowances & SKU Discontinuation Policy](/documents/vendor-trade-funds-discontinuation-policy.md)
