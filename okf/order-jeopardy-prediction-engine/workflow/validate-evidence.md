---
type: Workflow Stage
title: Validate Evidence
description: "Cross-check every finding against the Order Jeopardy Prediction Engine Service Assurance Runbook and cite the governing sections before any recommendation is issued."
source_id: validate_evidence
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Validate Evidence

Cross-check every finding against the Order Jeopardy Prediction Engine Service Assurance Runbook and cite the governing sections before any recommendation is issued.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [lookup_order_jeopardy_prediction_engine_assurance_runbook](/tools/lookup-order-jeopardy-prediction-engine-assurance-runbook.md)
- [action_netcracker_service_orchestration_draft](/tools/action-netcracker-service-orchestration-draft.md)

Next: [Act & Audit](/workflow/act-audit.md)
