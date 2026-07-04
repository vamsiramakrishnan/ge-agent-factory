---
type: Workflow Stage
title: "Lead Intake & Serviceability Check"
description: "Pull the new subscriber_accounts, service_quotes, and order_captures records from Salesforce Communications Cloud and verify serviceability_confirmed and credit_check_status before any scoring begins."
source_id: lead_intake_serviceability_check
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lead Intake & Serviceability Check

Pull the new subscriber_accounts, service_quotes, and order_captures records from Salesforce Communications Cloud and verify serviceability_confirmed and credit_check_status before any scoring begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [lookup_lead_qualification_scoring_engine_assurance_runbook](/tools/lookup-lead-qualification-scoring-engine-assurance-runbook.md)
- [action_salesforce_communications_cloud_route](/tools/action-salesforce-communications-cloud-route.md)

Next: [Firmographic & Usage-Intent Scoring](/workflow/firmographic-usage-intent-scoring.md)
