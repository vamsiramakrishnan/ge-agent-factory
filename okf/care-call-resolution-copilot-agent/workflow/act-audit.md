---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the draft step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Care Team Lead."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the draft step in Genesys Cloud CX with a full audit trail, and escalate exceptions to the Care Team Lead.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)
