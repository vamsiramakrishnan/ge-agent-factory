---
type: Workflow Stage
title: "Exception Escalation & Committee Routing"
description: "Route stacked LTV/DSCR exceptions, house-limit breaches, or uncured covenant_records breaches to senior_credit_officer, credit_committee_secretary, or special_assets_group per the escalation rules before any memo advances toward committee."
source_id: exception_escalation_committee_routing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Escalation & Committee Routing

Route stacked LTV/DSCR exceptions, house-limit breaches, or uncured covenant_records breaches to senior_credit_officer, credit_committee_secretary, or special_assets_group per the escalation rules before any memo advances toward committee.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)

Next: [Memo Generation & Audit Trail](/workflow/memo-generation-audit-trail.md)
