---
type: Proof Obligation
title: "Golden eval obligation — Run the Mid-Term Cancellation Retention Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-midterm-cancellation-retention-agent-end-to-end"
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

# Golden eval obligation — Run the Mid-Term Cancellation Retention Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [midterm-cancellation-retention-agent-end-to-end](/tests/midterm-cancellation-retention-agent-end-to-end.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_midterm_cancellation_retention_agent_authority_guide](/tools/lookup-midterm-cancellation-retention-agent-authority-guide.md)
- [action_guidewire_policycenter_generate](/tools/action-guidewire-policycenter-generate.md)

## Entities that must be referenced

- policies
- accounts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [midterm-cancellation-retention-agent-authority-guide](/documents/midterm-cancellation-retention-agent-authority-guide.md)
