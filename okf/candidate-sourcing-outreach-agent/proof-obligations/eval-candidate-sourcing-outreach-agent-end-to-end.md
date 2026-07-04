---
type: Proof Obligation
title: "Golden eval obligation — Run the Candidate Sourcing & Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-candidate-sourcing-outreach-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Candidate Sourcing & Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [candidate-sourcing-outreach-agent-end-to-end](/tests/candidate-sourcing-outreach-agent-end-to-end.md)


## Mechanisms

- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_indeed_indeed_records](/tools/query-indeed-indeed-records.md)
- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_gmail_messages](/tools/query-gmail-messages.md)
- [lookup_candidate_sourcing_outreach_agent_policy_handbook](/tools/lookup-candidate-sourcing-outreach-agent-policy-handbook.md)
- [action_linkedin_file](/tools/action-linkedin-file.md)

## Entities that must be referenced

- linkedin_records
- indeed_records
- ats_records
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [candidate-sourcing-outreach-agent-policy-handbook](/documents/candidate-sourcing-outreach-agent-policy-handbook.md)
