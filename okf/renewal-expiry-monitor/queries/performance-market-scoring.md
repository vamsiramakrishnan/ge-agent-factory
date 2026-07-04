---
type: Query Capability
title: "Aggregate supplier performance metrics (OTIF, quality PPM) and spend trends f..."
description: "Aggregate supplier performance metrics (OTIF, quality PPM) and spend trends from ERP. Benchmark current contract pricing against market rates. Score renewal recommendation based on composite performance."
source_id: "performance-market-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate supplier performance metrics (OTIF, quality PPM) and spend trends from ERP. Benchmark current contract pricing against market rates. Score renewal recommendation based on composite performance.

## Tools used

- [lookup_renewal_expiry_monitor_policy_guide](/tools/lookup-renewal-expiry-monitor-policy-guide.md)
- [action_icertis_recommend](/tools/action-icertis-recommend.md)

## Runs in

- [performance_market_scoring](/workflow/performance-market-scoring.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Renewal & Expiry Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/renewal-expiry-monitor-end-to-end.md)

# Citations

- [Renewal & Expiry Monitor Procurement Policy Guide](/documents/renewal-expiry-monitor-policy-guide.md)
