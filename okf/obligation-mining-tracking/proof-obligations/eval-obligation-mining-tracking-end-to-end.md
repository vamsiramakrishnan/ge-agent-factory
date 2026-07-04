---
type: Proof Obligation
title: "Golden eval obligation — Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-obligation-mining-tracking-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Obligation Mining & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [obligation-mining-tracking-end-to-end](/tests/obligation-mining-tracking-end-to-end.md)


## Mechanisms

- [query_icertis_contracts](/tools/query-icertis-contracts.md)
- [query_docusign_clm_contracts](/tools/query-docusign-clm-contracts.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [query_asana_jira_issues](/tools/query-asana-jira-issues.md)
- [lookup_obligation_mining_tracking_policy_guide](/tools/lookup-obligation-mining-tracking-policy-guide.md)
- [action_icertis_create](/tools/action-icertis-create.md)

## Entities that must be referenced

- contracts
- contracts
- events
- issues

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [obligation-mining-tracking-policy-guide](/documents/obligation-mining-tracking-policy-guide.md)
