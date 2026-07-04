---
type: Workflow Stage
title: "Remedy Selection & Runbook Validation"
description: "Match each ranked cell to the cheapest sufficient remedy (parameter rebalancing, carrier add, new site build) and validate the choice against the Cell Congestion Forecasting Engine Service Assurance Runbook and the Capacity Augment Prioritization Playbook (lookup_cell_congestion_forecasting_engine_assurance_runbook) before it reaches the capacity board."
source_id: remedy_selection_runbook_validation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Remedy Selection & Runbook Validation

Match each ranked cell to the cheapest sufficient remedy (parameter rebalancing, carrier add, new site build) and validate the choice against the Cell Congestion Forecasting Engine Service Assurance Runbook and the Capacity Augment Prioritization Playbook (lookup_cell_congestion_forecasting_engine_assurance_runbook) before it reaches the capacity board.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)

Next: [Capacity Board Publish & Audit](/workflow/capacity-board-publish-audit.md)
