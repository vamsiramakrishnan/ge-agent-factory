---
type: Workflow Stage
title: Cancellation Signal Intake
description: "Poll Guidewire PolicyCenter policies for policy_status transitions into pending_cancellation_nonpay or a fresh competitor-comparison inquiry, and correlate the named_insured against Salesforce Marketing Cloud accounts and opportunities to confirm the account is real and active."
source_id: cancellation_signal_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cancellation Signal Intake

Poll Guidewire PolicyCenter policies for policy_status transitions into pending_cancellation_nonpay or a fresh competitor-comparison inquiry, and correlate the named_insured against Salesforce Marketing Cloud accounts and opportunities to confirm the account is real and active.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)

Next: [Retention Value Scoring](/workflow/retention-value-scoring.md)
