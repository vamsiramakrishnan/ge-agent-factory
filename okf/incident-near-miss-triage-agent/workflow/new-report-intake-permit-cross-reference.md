---
type: Workflow Stage
title: "New-Report Intake & Permit Cross-Reference"
description: "Pull the newest safety_incidents record from Sphera EHS (query_sphera_ehs_safety_incidents) and cross-reference permit_records to see whether a loto, hot_work, confined_space_entry, or energized_electrical permit was active at the time of the event."
source_id: new_report_intake_permit_cross_reference
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# New-Report Intake & Permit Cross-Reference

Pull the newest safety_incidents record from Sphera EHS (query_sphera_ehs_safety_incidents) and cross-reference permit_records to see whether a loto, hot_work, confined_space_entry, or energized_electrical permit was active at the time of the event.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)
- [action_sphera_ehs_escalate](/tools/action-sphera-ehs-escalate.md)

Next: [Severity & OSHA Recordability Scoring](/workflow/severity-osha-recordability-scoring.md)
