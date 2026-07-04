---
type: Workflow Stage
title: "Multi-site address intake & CRM reconciliation"
description: "Pull the submitted address list along with subscriber_accounts and service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts, and resolve fuzzy address matches against prior order_captures history before any coverage lookup begins."
source_id: multi_site_address_intake_crm_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Multi-site address intake & CRM reconciliation

Pull the submitted address list along with subscriber_accounts and service_quotes from Salesforce Communications Cloud via query_salesforce_communications_cloud_subscriber_accounts, and resolve fuzzy address matches against prior order_captures history before any coverage lookup begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)
- [action_salesforce_communications_cloud_publish](/tools/action-salesforce-communications-cloud-publish.md)

Next: [Fiber route & lit-building coverage lookup](/workflow/fiber-route-lit-building-coverage-lookup.md)
