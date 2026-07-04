---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull subscriber_accounts and the linked service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts to score account tenure, churn_risk_score, and credit_check_status, so the Bid Manager decides which inbound RFPs are worth committing bid-team hours to before the 1-day first-draft clock starts.](/queries/rfp-intake-bid-qualification.md)
- [Cross-reference the RFP's proposed product_bundle and sales_channel in order_captures against open tickets, incidents, and change_requests in ServiceNow at the customer's sites, confirming serviceability_confirmed status before any capability is claimed in the compliance matrix.](/queries/portfolio-serviceability-feasibility-check.md)
- [Compare current mrr_usd, discount_pct, and contract_term commitments in service_quotes against BigQuery historical_metrics and analytics_events baselines to auto-build the compliance matrix, scoring each mandatory requirement the standard portfolio cannot meet.](/queries/compliance-matrix-gap-detection.md)
- [Route flagged technical exceptions and non-standard pricing concessions to the correct ServiceNow change_requests owner, or to sales_pricing_desk / enterprise_deal_desk per the Enterprise RFP Response Agent Bid Pricing & Delegation-of-Authority Manual, and track sign-off status before the response leaves draft.](/queries/exception-routing-sme-sign-off.md)
- [Assemble the final RFP response citing the Service Assurance Runbook and Bid Pricing Manual sections via lookup_enterprise_rfp_response_agent_assurance_runbook, then execute action_salesforce_communications_cloud_route to submit through Salesforce Communications Cloud with a full audit trail for the Bid Manager.](/queries/response-assembly-submission-audit.md)
