---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and usage records from Amdocs CES Billing and correlate with Zendesk for the Bill Dispute Resolution Agent workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and usage records from Amdocs CES Billing and correlate with Zendesk for the Bill Dispute Resolution Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_bill_dispute_resolution_agent_assurance_runbook](/tools/lookup-bill-dispute-resolution-agent-assurance-runbook.md)
- [action_amdocs_ces_billing_send](/tools/action-amdocs-ces-billing-send.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
