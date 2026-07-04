---
type: Workflow Stage
title: "Contact-reason mining & disposition override"
description: "Pull customer_interactions from Genesys Cloud CX and reclassify the true contact intent from channel, intent, cpni_authenticated, and agent_notes signals, overriding unreliable agent disposition codes per the Contact Driver Taxonomy & Cost-to-Serve Standard."
source_id: contact_reason_mining_disposition_override
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Contact-reason mining & disposition override

Pull customer_interactions from Genesys Cloud CX and reclassify the true contact intent from channel, intent, cpni_authenticated, and agent_notes signals, overriding unreliable agent disposition codes per the Contact Driver Taxonomy & Cost-to-Serve Standard.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_route](/tools/action-genesys-cloud-cx-route.md)

Next: [Emerging-cluster & baseline detection](/workflow/emerging-cluster-baseline-detection.md)
