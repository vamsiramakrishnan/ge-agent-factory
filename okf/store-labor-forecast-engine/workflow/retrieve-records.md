---
type: Workflow Stage
title: Retrieve Records
description: Query shift schedules and timecards from UKG Dimensions and correlate with Oracle Xstore POS for the Store Labor Forecast Engine workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query shift schedules and timecards from UKG Dimensions and correlate with Oracle Xstore POS for the Store Labor Forecast Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ukg_dimensions_shift_schedules](/tools/query-ukg-dimensions-shift-schedules.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_store_labor_forecast_engine_execution_playbook](/tools/lookup-store-labor-forecast-engine-execution-playbook.md)
- [action_ukg_dimensions_recommend](/tools/action-ukg-dimensions-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
