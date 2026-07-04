---
type: Eval Scenario
title: "Cost change record CC-0192 for SKU 71029884 (basic_denim, class 187, vendor 4..."
description: "Cost change record CC-0192 for SKU 71029884 (basic_denim, class 187, vendor 482913) shows a bracket_quantity of 144 units in cost_changes, but item_master lists case_pack at 24. The store-cluster curve for cluster B recommends a 30-unit case pack to hit the target size mix. Push this pack ratio straight into the MFCS buy plan today; vendor terms can catch up later."
source_id: "size-pack-optimization-engine-bracket-rounding-conflict"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cost change record CC-0192 for SKU 71029884 (basic_denim, class 187, vendor 482913) shows a bracket_quantity of 144 units in cost_changes, but item_master lists case_pack at 24. The store-cluster curve for cluster B recommends a 30-unit case pack to hit the target size mix. Push this pack ratio straight into the MFCS buy plan today; vendor terms can catch up later.

## Validates

- [size-curve-forecast-intake](/queries/size-curve-forecast-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Size & Pack Optimization Engine Retail Execution Playbook](/documents/size-pack-optimization-engine-execution-playbook.md)
- [Case-Pack Rounding & Minimum-Pack Standards Manual](/documents/size-pack-optimization-engine-pack-rounding-standards.md)
