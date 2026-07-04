---
type: Query Capability
title: "Compute brand awareness proxies, share of voice, sentiment trends, and brand ..."
description: "Compute brand awareness proxies, share of voice, sentiment trends, and brand association clusters. Time-series analysis on key metrics with anomaly detection."
source_id: "quantitative-analysis"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compute brand awareness proxies, share of voice, sentiment trends, and brand association clusters. Time-series analysis on key metrics with anomaly detection.

## Tools used

- [query_brandwatch_brand_mentions](/tools/query-brandwatch-brand-mentions.md)
- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [lookup_brand_health_monitor_playbook](/tools/lookup-brand-health-monitor-playbook.md)

## Runs in

- [quantitative_analysis](/workflow/quantitative-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Brand Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/brand-health-monitor-end-to-end.md)

# Citations

- [Brand Health Monitor Playbook](/documents/brand-health-monitor-playbook.md)
