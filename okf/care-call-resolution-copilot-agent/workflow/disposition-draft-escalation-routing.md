---
type: Workflow Stage
title: "Disposition Draft & Escalation Routing"
description: "Execute action_genesys_cloud_cx_draft to log the structured wrap-up note, disposition code, and audit_record_id in Genesys Cloud CX, or route the case to retention_supervisor, resolution_desk, or executive_relations per the escalation rules."
source_id: disposition_draft_escalation_routing
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition Draft & Escalation Routing

Execute action_genesys_cloud_cx_draft to log the structured wrap-up note, disposition code, and audit_record_id in Genesys Cloud CX, or route the case to retention_supervisor, resolution_desk, or executive_relations per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_care_call_resolution_copilot_agent_assurance_runbook](/tools/lookup-care-call-resolution-copilot-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_draft](/tools/action-genesys-cloud-cx-draft.md)
