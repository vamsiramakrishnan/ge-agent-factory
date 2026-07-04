---
type: Query Capability
title: "Ingest commodity price feeds from multiple providers across metals, polymers,..."
description: "Ingest commodity price feeds from multiple providers across metals, polymers, energy, and agriculture. Store in BigQuery time-series with normalization across different index formats and update frequencies."
source_id: "index-ingestion-storage"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest commodity price feeds from multiple providers across metals, polymers, energy, and agriculture. Store in BigQuery time-series with normalization across different index formats and update frequencies.

## Tools used

- [lookup_commodity_price_forecaster_policy_guide](/tools/lookup-commodity-price-forecaster-policy-guide.md)

## Runs in

- [index_ingestion_storage](/workflow/index-ingestion-storage.md)

## Evidence expected

- document_reference

## Evals

- [Run the Commodity Price Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commodity-price-forecaster-end-to-end.md)

# Citations

- [Commodity Price Forecaster Procurement Policy Guide](/documents/commodity-price-forecaster-policy-guide.md)
