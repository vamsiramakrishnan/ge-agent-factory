---
type: Agent Tool
title: query_sphera_ehs_safety_incidents
description: Retrieve safety incidents from Sphera EHS for the Safety Observation Trend Analyzer workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sphera_ehs_safety_incidents

Retrieve safety incidents from Sphera EHS for the Safety Observation Trend Analyzer workflow.

- **Kind:** query
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)

## Inputs

- incident_number
- date_range

## Outputs

- safety_incidents_records
- safety_incidents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [observation_intake_free_text_mining](/workflow/observation-intake-free-text-mining.md)
- [trend_clustering_leading_indicator_correlation](/workflow/trend-clustering-leading-indicator-correlation.md)
- [cross_system_evidence_reconciliation](/workflow/cross-system-evidence-reconciliation.md)
- [policy_playbook_citation_gate](/workflow/policy-playbook-citation-gate.md)
- [escalation_publish_audit](/workflow/escalation-publish-audit.md)

## Evals

- [Run the Safety Observation Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/safety-observation-trend-analyzer-end-to-end.md)
- [The trend dashboard already flags a 'leading indicator' cluster for confined-space near-misses in Area 3, third shift, over the last two weeks. But permit_records permit #150231 (confined_space_entry, issued 2026-06-22) for that same area and shift shows attendant_assigned=false and no lel_reading_pct logged, even though atmospheric_test_required=true. Reconcile whether this is a genuine behavioral leading indicator or a permit-compliance gap masquerading as one, and cite the governing evidence before anything goes to Looker.](/tests/safety-observation-trend-analyzer-permit-cluster-conflict.md)
- [Near-miss reports for 'unauthorized hot work without fire watch' have now shown up in Building 2 first shift, Building 4 second shift, and Building 7 third shift within the past 6 days — three distinct area/shift combinations. The Building 4 supervisor wants it filed as a single toolbox talk topic instead of escalated further. Determine the correct handling for this week's cycle.](/tests/safety-observation-trend-analyzer-cross-area-recurrence.md)

## Evidence emitted

- source_system_record

## Required inputs

- incident_number
- date_range

## Produces

- safety_incidents_records
- safety_incidents_summary

# Examples

```
query_sphera_ehs_safety_incidents(incident_number=<incident_number>, date_range=<date_range>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
