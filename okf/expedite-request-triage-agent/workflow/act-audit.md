---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the approve step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Procurement Buyer."
source_id: act_audit
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the approve step in Kinaxis RapidResponse with a full audit trail, and escalate exceptions to the Procurement Buyer.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [lookup_expedite_request_triage_agent_sop](/tools/lookup-expedite-request-triage-agent-sop.md)
- [action_sap_s_4hana_mm_approve](/tools/action-sap-s-4hana-mm-approve.md)
