---
type: Proof Obligation
title: "Golden eval obligation — Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-conversion-rate-optimization-agent-end-to-end"
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

# Golden eval obligation — Run the Conversion Rate Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [conversion-rate-optimization-agent-end-to-end](/tests/conversion-rate-optimization-agent-end-to-end.md)


## Mechanisms

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_hotjar_hotjar_records](/tools/query-hotjar-hotjar-records.md)
- [query_google_optimize_google_optimize_records](/tools/query-google-optimize-google-optimize-records.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_conversion_rate_optimization_agent_playbook](/tools/lookup-conversion-rate-optimization-agent-playbook.md)
- [action_hotjar_generate](/tools/action-hotjar-generate.md)

## Entities that must be referenced

- session_events
- hotjar_records
- google_optimize_records
- contacts
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [conversion-rate-optimization-agent-playbook](/documents/conversion-rate-optimization-agent-playbook.md)
