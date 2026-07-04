---
type: Workflow Stage
title: "Price-of-Record Intake"
description: Pull current price_recommendations and price_zones from Revionics Price Optimization by sku and price_zone_id to establish the price of record for the audit window.
source_id: price_of_record_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Price-of-Record Intake

Pull current price_recommendations and price_zones from Revionics Price Optimization by sku and price_zone_id to establish the price of record for the audit window.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_price_execution_audit_monitor_execution_playbook](/tools/lookup-price-execution-audit-monitor-execution-playbook.md)

Next: [POS Scan Reconciliation](/workflow/pos-scan-reconciliation.md)
