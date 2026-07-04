---
type: Workflow Stage
title: "Contact Authentication & Context Assembly"
description: "Pull the live record from Genesys Cloud CX customer_interactions (cpni_authenticated, account_number, channel, intent) via query_genesys_cloud_cx_customer_interactions and assemble the unified billing/device/order context before the Care Team Lead's agent says hello."
source_id: contact_authentication_context_assembly
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Contact Authentication & Context Assembly

Pull the live record from Genesys Cloud CX customer_interactions (cpni_authenticated, account_number, channel, intent) via query_genesys_cloud_cx_customer_interactions and assemble the unified billing/device/order context before the Care Team Lead's agent says hello.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)

Next: [Queue & Baseline Health Check](/workflow/queue-baseline-health-check.md)
