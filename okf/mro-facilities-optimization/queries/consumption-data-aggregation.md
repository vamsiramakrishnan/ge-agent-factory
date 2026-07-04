---
type: Query Capability
title: Pull MRO consumption data from CMMS and ERP plant maintenance modules. Correl...
description: Pull MRO consumption data from CMMS and ERP plant maintenance modules. Correlate consumption patterns with maintenance work orders and turnaround schedules to distinguish trend changes from planned events.
source_id: "consumption-data-aggregation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull MRO consumption data from CMMS and ERP plant maintenance modules. Correlate consumption patterns with maintenance work orders and turnaround schedules to distinguish trend changes from planned events.

## Tools used

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)

## Runs in

- [consumption_data_aggregation](/workflow/consumption-data-aggregation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/mro-facilities-optimization-end-to-end.md)

# Citations

- [MRO & Facilities Optimization Procurement Policy Guide](/documents/mro-facilities-optimization-policy-guide.md)
