---
type: Workflow Stage
title: "Team-Lead Routing & Audit"
description: "Route any draft touching a denial, complaint, or filed_pending_doi form to the Customer Service Team Lead for one-pass approval, execute action_duck_creek_policy_route to log the send with an audit trail, and check the satisfaction_scores trend on the ticket before closing."
source_id: team_lead_routing_audit
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Team-Lead Routing & Audit

Route any draft touching a denial, complaint, or filed_pending_doi form to the Customer Service Team Lead for one-pass approval, execute action_duck_creek_policy_route to log the send with an audit trail, and check the satisfaction_scores trend on the ticket before closing.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)
