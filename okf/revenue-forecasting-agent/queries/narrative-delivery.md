---
type: Query Capability
title: "Generate forecast narrative for earnings prep with key drivers, risk deals, a..."
description: "Generate forecast narrative for earnings prep with key drivers, risk deals, and upside opportunities highlighted."
source_id: "narrative-delivery"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate forecast narrative for earnings prep with key drivers, risk deals, and upside opportunities highlighted.

## Tools used

- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Runs in

- [narrative_delivery](/workflow/narrative-delivery.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Revenue Forecasting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-forecasting-agent-end-to-end.md)

# Citations

- [Revenue Forecasting Agent Controls Playbook](/documents/revenue-forecasting-agent-controls-playbook.md)
