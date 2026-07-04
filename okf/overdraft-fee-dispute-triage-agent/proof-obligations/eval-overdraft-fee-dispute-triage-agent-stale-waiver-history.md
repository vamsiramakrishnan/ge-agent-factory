---
type: Proof Obligation
title: "Golden eval obligation — Ticket INC0091167 disputes a $35 overdraft fee on account 71304519, filed 2026-07-03. The last BigQuery analytics_events refresh for this account is timestamped 2026-06-30 21:00 UTC (over 24 hours old) and shows exactly 2 prior waivers in the trailing 12 months, right at the tier-2 threshold in the waiver authority playbook. Determine whether this ticket can be adjudicated now or must wait for fresh evidence, and state the correct next step."
description: golden eval proof obligation
source_id: "eval-overdraft-fee-dispute-triage-agent-stale-waiver-history"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Ticket INC0091167 disputes a $35 overdraft fee on account 71304519, filed 2026-07-03. The last BigQuery analytics_events refresh for this account is timestamped 2026-06-30 21:00 UTC (over 24 hours old) and shows exactly 2 prior waivers in the trailing 12 months, right at the tier-2 threshold in the waiver authority playbook. Determine whether this ticket can be adjudicated now or must wait for fresh evidence, and state the correct next step.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [overdraft-fee-dispute-triage-agent-stale-waiver-history](/tests/overdraft-fee-dispute-triage-agent-stale-waiver-history.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_overdraft_fee_dispute_triage_agent_compliance_policy](/tools/lookup-overdraft-fee-dispute-triage-agent-compliance-policy.md)

## Entities that must be referenced

- core_accounts
- analytics_events
- tickets

## Forbidden behaviors

- adjudicating the refund on stale (>24h) analytics data
- auto-approving at exactly the tier threshold without escalation review

# Citations

- [overdraft-fee-dispute-triage-agent-compliance-policy](/documents/overdraft-fee-dispute-triage-agent-compliance-policy.md)
- [overdraft-courtesy-waiver-authority-matrix](/documents/overdraft-courtesy-waiver-authority-matrix.md)
