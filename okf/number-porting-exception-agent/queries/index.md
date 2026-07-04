---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the rejected port-in service_orders record and the losing-carrier CSR fields surfaced through Netcracker Service Orchestration, correlating with any open Zendesk tickets to isolate the single mismatched attribute (account number, billing name, or service address ZIP) that triggered the reject.](/queries/port-rejection-intake-csr-comparison.md)
- [Cross-reference provisioning_tasks (e911_address_load, switch_translation, hlr_hss_update) and network_inventory_items admin_state/vendor in Netcracker Service Orchestration to determine whether the reject originates in the losing carrier's CSR or in the winning carrier's own fallout.](/queries/provisioning-fallout-correlation.md)
- [Score the port-in against BigQuery's historical_metrics and analytics_events rejection-rate baseline, and check elapsed business time against the FCC one-business-day simple-port interval to set priority in the Porting Desk Analyst's queue.](/queries/baseline-regulatory-interval-scoring.md)
- [Cite the governing sections of the Number Porting Exception Agent Service Assurance Runbook and the LNP Reject Reason Code & Porting Interval Manual via lookup_number_porting_exception_agent_assurance_runbook before drafting any resubmission or escalation rationale.](/queries/runbook-reject-code-evidence-validation.md)
- [Draft the corrected LSR resubmission for one-click Porting Desk Analyst approval, or execute action_netcracker_service_orchestration_escalate in Netcracker Service Orchestration with a full audit trail when evidence and interval gates require a handoff.](/queries/resubmission-drafting-or-escalation-audit.md)
