---
type: Workflow Stage
title: "Publish, Channel Sync & Restoration Confirmation"
description: "Execute action_genesys_cloud_cx_publish to push the one consistent message to customer notifications, IVR, and agent desktops with a generated_audit_trail, then re-query customer_interactions and queue_metrics after the incidents record closes to confirm restoration with impacted customers."
source_id: publish_channel_sync_restoration_confirmation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Publish, Channel Sync & Restoration Confirmation

Execute action_genesys_cloud_cx_publish to push the one consistent message to customer notifications, IVR, and agent desktops with a generated_audit_trail, then re-query customer_interactions and queue_metrics after the incidents record closes to confirm restoration with impacted customers.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)
