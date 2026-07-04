---
type: Workflow Stage
title: "Filing Clock & Continuing-Activity Tracking"
description: "Track the 30-day filing_deadline_date clock and 90-day continuing_activity_supplemental reviews against ServiceNow tickets logging case handling delays, escalating any case at risk of missing deadline to the AML Compliance Officer."
source_id: filing_clock_continuing_activity_tracking
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Filing Clock & Continuing-Activity Tracking

Track the 30-day filing_deadline_date clock and 90-day continuing_activity_supplemental reviews against ServiceNow tickets logging case handling delays, escalating any case at risk of missing deadline to the AML Compliance Officer.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_sar_filing_preparation_agent_compliance_policy](/tools/lookup-sar-filing-preparation-agent-compliance-policy.md)

Next: [Filing & Audit Trail](/workflow/filing-audit-trail.md)
