---
type: Workflow Stage
title: "Entitlement & Usage Merge"
description: "Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and login frequency from Okta. Build entitlement-vs-usage matrix for every licensed product."
source_id: entitlement_usage_merge
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Entitlement & Usage Merge

Pull license entitlements from ServiceNow SAM, SaaS usage from Zylo, and login frequency from Okta. Build entitlement-vs-usage matrix for every licensed product.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_sam_tickets](/tools/query-servicenow-sam-tickets.md)
- [query_zylo_zylo_records](/tools/query-zylo-zylo-records.md)
- [query_okta_users](/tools/query-okta-users.md)
- [lookup_license_compliance_monitor_runbook](/tools/lookup-license-compliance-monitor-runbook.md)

Next: [Compliance Gap Analysis](/workflow/compliance-gap-analysis.md)
