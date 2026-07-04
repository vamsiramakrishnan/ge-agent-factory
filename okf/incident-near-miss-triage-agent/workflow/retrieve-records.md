---
type: Workflow Stage
title: Retrieve Records
description: "Query safety incidents and permit records from Sphera EHS and correlate with ServiceNow for the Incident and Near-Miss Triage Agent workflow."
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query safety incidents and permit records from Sphera EHS and correlate with ServiceNow for the Incident and Near-Miss Triage Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
