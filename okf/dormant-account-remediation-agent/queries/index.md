---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query core_accounts, account_transactions, and standing_orders from Temenos Transact via query_temenos_transact_core_accounts, query_temenos_transact_account_transactions, and query_temenos_transact_standing_orders to classify each account_status against the state-specific escheatment dormancy trigger for its product_type.](/queries/dormancy-classification-escheatment-calendar-match.md)
- [Cross-check flagged accounts against BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events, query_bigquery_historical_metrics) to rule out reporting-lag false positives before an account is treated as truly dormant.](/queries/activity-baseline-reconciliation.md)
- [Draft personalized re-contact letters addressed to primary_holder_name on core_accounts and verify beneficiary_name and order_status on any linked standing_orders, citing the Dormant Account Remediation Agent Banking Compliance Policy for required notice language.](/queries/owner-contactability-outreach-drafting.md)
- [Score current_balance and days-to-statutory-deadline for each cohort, then assemble the escheatment filing package using lookup_dormant_account_remediation_agent_compliance_policy citations for accounts inside the state filing window.](/queries/statutory-deadline-triage-filing-package-assembly.md)
- [Open ServiceNow tickets and change_requests (query_servicenow_tickets, query_servicenow_change_requests) to route accounts needing branch-level verification or address updates into the Deposit Operations Analyst queue.](/queries/branch-queue-task-routing.md)
- [Execute action_temenos_transact_escalate against Temenos Transact for accounts requiring an officer override, log the generated_audit_trail, and notify the Deposit Operations Analyst of the outcome.](/queries/escalation-audit-trail.md)
