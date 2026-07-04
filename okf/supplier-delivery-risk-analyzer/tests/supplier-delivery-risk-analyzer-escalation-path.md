---
type: Eval Scenario
title: While running the Supplier Delivery Risk Analyzer workflow you encounter this...
description: "While running the Supplier Delivery Risk Analyzer workflow you encounter this condition: Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted. Handle it end to end."
source_id: "supplier-delivery-risk-analyzer-escalation-path"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# While running the Supplier Delivery Risk Analyzer workflow you encounter this condition: Projected line-down: material coverage below 24 hours at a constraint work center with staging_status shorted. Handle it end to end.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Supplier Delivery Risk Analyzer Standard Operating Procedure](/documents/supplier-delivery-risk-analyzer-sop.md)
