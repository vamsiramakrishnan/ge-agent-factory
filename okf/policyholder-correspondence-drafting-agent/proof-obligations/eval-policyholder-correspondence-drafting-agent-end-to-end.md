---
type: Proof Obligation
title: "Golden eval obligation — Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-policyholder-correspondence-drafting-agent-end-to-end"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Policyholder Correspondence Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [policyholder-correspondence-drafting-agent-end-to-end](/tests/policyholder-correspondence-drafting-agent-end-to-end.md)


## Mechanisms

- [query_duck_creek_policy_policy_forms](/tools/query-duck-creek-policy-policy-forms.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_policyholder_correspondence_drafting_agent_authority_guide](/tools/lookup-policyholder-correspondence-drafting-agent-authority-guide.md)
- [action_duck_creek_policy_route](/tools/action-duck-creek-policy-route.md)

## Entities that must be referenced

- policy_forms
- tickets
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [policyholder-correspondence-drafting-agent-authority-guide](/documents/policyholder-correspondence-drafting-agent-authority-guide.md)
