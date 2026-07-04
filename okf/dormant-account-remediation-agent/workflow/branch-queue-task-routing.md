---
type: Workflow Stage
title: "Branch & Queue Task Routing"
description: "Open ServiceNow tickets and change_requests (query_servicenow_tickets, query_servicenow_change_requests) to route accounts needing branch-level verification or address updates into the Deposit Operations Analyst queue."
source_id: branch_queue_task_routing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Branch & Queue Task Routing

Open ServiceNow tickets and change_requests (query_servicenow_tickets, query_servicenow_change_requests) to route accounts needing branch-level verification or address updates into the Deposit Operations Analyst queue.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_dormant_account_remediation_agent_compliance_policy](/tools/lookup-dormant-account-remediation-agent-compliance-policy.md)

Next: [Escalation & Audit Trail](/workflow/escalation-audit-trail.md)
