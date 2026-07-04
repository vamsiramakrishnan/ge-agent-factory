---
type: Workflow Stage
title: Telemetry Collection
description: "Pull software inventory from ServiceNow SAM, SaaS spend and usage from Zylo, and SSO login frequency from Okta. Build comprehensive view of tool landscape."
source_id: telemetry_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Telemetry Collection

Pull software inventory from ServiceNow SAM, SaaS spend and usage from Zylo, and SSO login frequency from Okta. Build comprehensive view of tool landscape.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [action_servicenow_sam_recommend](/tools/action-servicenow-sam-recommend.md)

Next: [Consolidation Reasoning](/workflow/consolidation-reasoning.md)
