---
type: Proof Obligation
title: "Golden eval obligation — Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-lead-scoring-qualification-agent-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Lead Scoring & Qualification Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [lead-scoring-qualification-agent-end-to-end](/tests/lead-scoring-qualification-agent-end-to-end.md)


## Mechanisms

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_6sense_6sense_records](/tools/query-6sense-6sense-records.md)
- [query_demandbase_demandbase_records](/tools/query-demandbase-demandbase-records.md)
- [lookup_lead_scoring_qualification_agent_playbook](/tools/lookup-lead-scoring-qualification-agent-playbook.md)
- [action_hubspot_post](/tools/action-hubspot-post.md)

## Entities that must be referenced

- contacts
- accounts
- 6sense_records
- demandbase_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute post without two-system evidence

# Citations

- [lead-scoring-qualification-agent-playbook](/documents/lead-scoring-qualification-agent-playbook.md)
