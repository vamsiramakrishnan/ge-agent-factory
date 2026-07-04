---
type: Workflow Stage
title: Retrieve Records
description: "Query policies and policy quotes from Guidewire PolicyCenter and correlate with Salesforce Marketing Cloud for the Mid-Term Cancellation Retention Agent workflow."
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query policies and policy quotes from Guidewire PolicyCenter and correlate with Salesforce Marketing Cloud for the Mid-Term Cancellation Retention Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
