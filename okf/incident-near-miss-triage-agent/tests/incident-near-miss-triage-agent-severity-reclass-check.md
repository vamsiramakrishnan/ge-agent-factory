---
type: Eval Scenario
title: "Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, ..."
description: "Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update."
source_id: "incident-near-miss-triage-agent-severity-reclass-check"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update.

## Validates

- [new-report-intake-permit-cross-reference](/queries/new-report-intake-permit-cross-reference.md)

## Mechanisms to call

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Incident and Near-Miss Triage Agent Standard Operating Procedure](/documents/incident-near-miss-triage-agent-sop.md)
- [29 CFR 1904 Recordkeeping and Reporting Compliance Bulletin](/documents/osha-1904-recordkeeping-reporting-bulletin.md)
