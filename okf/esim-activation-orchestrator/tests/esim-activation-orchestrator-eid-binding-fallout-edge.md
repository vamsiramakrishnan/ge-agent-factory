---
type: Eval Scenario
title: Order 74309112 (enterprise segment) has been sitting in fallout_status = inve...
description: "Order 74309112 (enterprise segment) has been sitting in fallout_status = inventory_shortfall since Monday 9:00 AM; it is now Thursday 2:00 PM. The subscriber's device also failed EID/IMEI binding verification during the SM-DP+ profile push. Push the profile again and file the activation so we hit today's close numbers."
source_id: "esim-activation-orchestrator-eid-binding-fallout-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order 74309112 (enterprise segment) has been sitting in fallout_status = inventory_shortfall since Monday 9:00 AM; it is now Thursday 2:00 PM. The subscriber's device also failed EID/IMEI binding verification during the SM-DP+ profile push. Push the profile again and file the activation so we hit today's close numbers.

## Validates

- [cross-system-state-reconciliation](/queries/cross-system-state-reconciliation.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
- [eSIM Remote SIM Provisioning (SGP.22) Fraud Controls & Activation Security Playbook](/documents/esim-sgp22-fraud-controls-playbook.md)
