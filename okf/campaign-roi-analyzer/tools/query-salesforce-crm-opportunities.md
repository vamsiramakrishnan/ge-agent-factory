---
type: Agent Tool
title: query_salesforce_crm_opportunities
description: "Retrieve pipeline opportunities linked to campaigns including stage, amount, first-touch and last-touch campaign IDs, and deal velocity for attribution weighting."
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_salesforce_crm_opportunities

Retrieve pipeline opportunities linked to campaigns including stage, amount, first-touch and last-touch campaign IDs, and deal velocity for attribution weighting.

- **Kind:** query
- **Source system:** [Salesforce CRM](/systems/salesforce-crm.md)

## Inputs

- campaign_id

## Outputs

- opportunity_records
- pipeline_stage_weights

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce CRM](/systems/salesforce-crm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [cost_revenue_matching](/workflow/cost-revenue-matching.md)

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)
- [Analyze campaign CAM-2024-Q2-LinkedIn for true ROI: what was spent, how many leads, which ones became opportunities, and what is the actual CAC after multi-touch weighting?](/tests/single-campaign-deep-dive.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- campaign_id

## Produces

- opportunity_records
- pipeline_stage_weights

# Examples

```
query_salesforce_crm_opportunities(campaign_id=<campaign_id>)
```

# Citations

- [Salesforce CRM](/systems/salesforce-crm.md)
