---
type: Workflow Stage
title: Error Signature Classification
description: "Classify each record's fallout_status and error_code (address_validation, switch_reject, lnp_delay, inventory_shortfall, manual_task_pending, ne_timeout, data_mismatch, port_unavailable, address_invalid) against known-pattern signatures to decide whether it is auto-remediable or needs a human."
source_id: error_signature_classification
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Error Signature Classification

Classify each record's fallout_status and error_code (address_validation, switch_reject, lnp_delay, inventory_shortfall, manual_task_pending, ne_timeout, data_mismatch, port_unavailable, address_invalid) against known-pattern signatures to decide whether it is auto-remediable or needs a human.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)

Next: [Baseline Benchmarking](/workflow/baseline-benchmarking.md)
