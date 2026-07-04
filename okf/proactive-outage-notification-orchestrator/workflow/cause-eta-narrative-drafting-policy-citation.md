---
type: Workflow Stage
title: "Cause/ETA Narrative Drafting & Policy Citation"
description: "Draft the customer-facing cause, ETA, and restoration-progress narrative for the bound incidents record, citing the assurance runbook's customer-communication section via lookup_proactive_outage_notification_orchestrator_assurance_runbook and the Network Outage Regulatory & Customer Notification Policy's notification-sla and messaging-consistency anchors before release."
source_id: cause_eta_narrative_drafting_policy_citation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cause/ETA Narrative Drafting & Policy Citation

Draft the customer-facing cause, ETA, and restoration-progress narrative for the bound incidents record, citing the assurance runbook's customer-communication section via lookup_proactive_outage_notification_orchestrator_assurance_runbook and the Network Outage Regulatory & Customer Notification Policy's notification-sla and messaging-consistency anchors before release.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_proactive_outage_notification_orchestrator_assurance_runbook](/tools/lookup-proactive-outage-notification-orchestrator-assurance-runbook.md)

Next: [Publish, Channel Sync & Restoration Confirmation](/workflow/publish-channel-sync-restoration-confirmation.md)
