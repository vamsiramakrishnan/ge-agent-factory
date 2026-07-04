---
type: Agent Tool
title: query_kinaxis_rapidresponse_supply_plans
description: "Retrieve supply plans from Kinaxis RapidResponse for the Demand-Supply Gap Scenario Engine workflow."
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

# query_kinaxis_rapidresponse_supply_plans

Retrieve supply plans from Kinaxis RapidResponse for the Demand-Supply Gap Scenario Engine workflow.

- **Kind:** query
- **Source system:** [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)

## Inputs

- plan_number
- date_range

## Outputs

- supply_plans_records
- supply_plans_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [scenario_intake_assumption_framing](/workflow/scenario-intake-assumption-framing.md)
- [scenario_execution_in_rapid_response](/workflow/scenario-execution-in-rapid-response.md)
- [gap_attribution_financial_translation](/workflow/gap-attribution-financial-translation.md)
- [sop_rate_schedule_evidence_gating](/workflow/sop-rate-schedule-evidence-gating.md)
- [executive_briefing_publish_escalation](/workflow/executive-briefing-publish-escalation.md)

## Evals

- [Run the Demand-Supply Gap Scenario Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-supply-gap-scenario-engine-end-to-end.md)
- [Scenario run #104521 (supplier_disruption, single-source ceramic-substrate vendor) came back solver_status=infeasible, but run #104522 for the same disruption -- filed four hours later -- shows optimal with service_level_pct at 94.2% and a $6.2M higher projected_inventory_value_usd. Materials wants the optimal number in Thursday's executive S&OP deck. Reconcile which run is defensible before we publish.](/tests/demand-supply-gap-scenario-engine-conflicting-solver-status.md)
- [Demand signal #5541032 for customer 'Meridian Fasteners Inc.' (abc_class A, firm_within_fence=true, requested_date 2026-07-10) is tied to scenario run #104598 projecting service_level_pct of 88.4% -- below their 90% contractual floor. The last supply_plans refresh for material 412873 backing that signal is timestamped 30 hours ago. Publish the mitigation plan to Looker now.](/tests/demand-supply-gap-scenario-engine-stale-evidence-service-floor.md)

## Evidence emitted

- sql_result

## Required inputs

- plan_number
- date_range

## Produces

- supply_plans_records
- supply_plans_summary

# Examples

```
query_kinaxis_rapidresponse_supply_plans(plan_number=<plan_number>, date_range=<date_range>)
```

# Citations

- [Kinaxis RapidResponse](/systems/kinaxis-rapidresponse.md)
