---
type: Query Capability
title: "Gemini reads carrier delay notifications — 'shipment held at customs, documen..."
description: "Gemini reads carrier delay notifications — 'shipment held at customs, documentation discrepancy' — and reasons about likely delay duration and production impact. Generates proactive alerts: '3 shipments from Supplier Y predicted 2-day delay due to Long Beach port congestion — recommend notifying Plant B and activating buffer stock.'"
source_id: "exception-interpretation-alerting"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads carrier delay notifications — 'shipment held at customs, documentation discrepancy' — and reasons about likely delay duration and production impact. Generates proactive alerts: '3 shipments from Supplier Y predicted 2-day delay due to Long Beach port congestion — recommend notifying Plant B and activating buffer stock.'

## Tools used

- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Runs in

- [exception_interpretation_alerting](/workflow/exception-interpretation-alerting.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Delivery Performance Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/delivery-performance-monitor-end-to-end.md)

# Citations

- [Delivery Performance Monitor Procurement Policy Guide](/documents/delivery-performance-monitor-policy-guide.md)
