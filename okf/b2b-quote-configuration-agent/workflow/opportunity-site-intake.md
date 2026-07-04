---
type: Workflow Stage
title: "Opportunity & Site Intake"
description: "Pull the multi-site opportunity from Salesforce Communications Cloud — subscriber_accounts and service_quotes (business_name, product_bundle, contract_term, mrr_usd) — via query_salesforce_communications_cloud_subscriber_accounts to fix scope before any line item is priced."
source_id: opportunity_site_intake
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Opportunity & Site Intake

Pull the multi-site opportunity from Salesforce Communications Cloud — subscriber_accounts and service_quotes (business_name, product_bundle, contract_term, mrr_usd) — via query_salesforce_communications_cloud_subscriber_accounts to fix scope before any line item is priced.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_b2b_quote_configuration_agent_assurance_runbook](/tools/lookup-b2b-quote-configuration-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

Next: [Serviceability & Credit Gating](/workflow/serviceability-credit-gating.md)
