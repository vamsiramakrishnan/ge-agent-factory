---
type: Workflow Stage
title: "ETA Notification & Audit Close-Out"
description: "Push live technician ETAs to customers, auto-rebook any service_appointments record that falls outside its window, and log the audit trail for the Field Operations Supervisor."
source_id: eta_notification_audit_close_out
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ETA Notification & Audit Close-Out

Push live technician ETAs to customers, auto-rebook any service_appointments record that falls outside its window, and log the audit trail for the Field Operations Supervisor.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)
