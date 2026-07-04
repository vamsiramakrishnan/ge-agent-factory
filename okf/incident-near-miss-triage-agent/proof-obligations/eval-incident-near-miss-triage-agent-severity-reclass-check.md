---
type: Proof Obligation
title: "Golden eval obligation — Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update."
description: golden eval proof obligation
source_id: "eval-incident-near-miss-triage-agent-severity-reclass-check"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Incident #43217 in Sphera EHS was logged with osha_classification=near_miss, but injury_type says fracture with 14 days_away. It happened during confined-space permit #151932, which shows attendant_assigned=false in permit_records. Reconcile the record and tell me whether this needs to be recoded as OSHA recordable before Friday's log update.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [incident-near-miss-triage-agent-severity-reclass-check](/tests/incident-near-miss-triage-agent-severity-reclass-check.md)


## Mechanisms

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [lookup_incident_near_miss_triage_agent_sop](/tools/lookup-incident-near-miss-triage-agent-sop.md)

## Entities that must be referenced

- safety_incidents
- permit_records

## Forbidden behaviors

- Accepting the near_miss classification at face value without flagging the injury_type conflict
- Recommending the OSHA 300 log entry be finalized before the recordability question is resolved

# Citations

- [incident-near-miss-triage-agent-sop](/documents/incident-near-miss-triage-agent-sop.md)
- [osha-1904-recordkeeping-reporting-bulletin](/documents/osha-1904-recordkeeping-reporting-bulletin.md)
