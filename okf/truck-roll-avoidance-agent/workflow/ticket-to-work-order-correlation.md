---
type: Workflow Stage
title: "Ticket-to-Work-Order Correlation"
description: Match incoming Zendesk tickets against open field_work_orders and service_appointments in Oracle Field Service to confirm whether a dispatch is already queued for the premise before any new diagnostic work starts.
source_id: ticket_to_work_order_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ticket-to-Work-Order Correlation

Match incoming Zendesk tickets against open field_work_orders and service_appointments in Oracle Field Service to confirm whether a dispatch is already queued for the premise before any new diagnostic work starts.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

Next: [Remote Diagnostic Battery](/workflow/remote-diagnostic-battery.md)
