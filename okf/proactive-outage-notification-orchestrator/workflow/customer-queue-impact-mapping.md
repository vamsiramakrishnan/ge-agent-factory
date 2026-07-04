---
type: Workflow Stage
title: "Customer & Queue Impact Mapping"
description: "Correlate the confirmed incidents record against Genesys Cloud CX customer_interactions (intent='network_complaint') and queue_metrics (offered_contacts, abandon_rate_pct) by queue_name, cross-checked with agent_schedules coverage, to size the exact affected customer base and contact-center exposure."
source_id: customer_queue_impact_mapping
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Customer & Queue Impact Mapping

Correlate the confirmed incidents record against Genesys Cloud CX customer_interactions (intent='network_complaint') and queue_metrics (offered_contacts, abandon_rate_pct) by queue_name, cross-checked with agent_schedules coverage, to size the exact affected customer base and contact-center exposure.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_publish](/tools/action-genesys-cloud-cx-publish.md)

Next: [Severity & Notification-Tier Scoring](/workflow/severity-notification-tier-scoring.md)
