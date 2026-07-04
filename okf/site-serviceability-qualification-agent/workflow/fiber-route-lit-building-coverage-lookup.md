---
type: Workflow Stage
title: "Fiber route & lit-building coverage lookup"
description: "Query the network facilities inventory system (TELCO 3) with query_telco_3_telco_3_records to determine on-net lit-building status, fiber route proximity, and fixed-wireless coverage footprint for each address matched against telco_3_records."
source_id: fiber_route_lit_building_coverage_lookup
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fiber route & lit-building coverage lookup

Query the network facilities inventory system (TELCO 3) with query_telco_3_telco_3_records to determine on-net lit-building status, fiber route proximity, and fixed-wireless coverage footprint for each address matched against telco_3_records.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)

Next: [Near-net lateral build-cost & interval scoring](/workflow/near-net-lateral-build-cost-interval-scoring.md)
