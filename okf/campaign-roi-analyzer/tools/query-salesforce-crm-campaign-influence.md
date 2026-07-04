---
type: Agent Tool
title: query_salesforce_crm_campaign_influence
description: "Retrieve campaign influence records showing attributed revenue, influence weights by model, and audit trail for multi-touch attribution validation."
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

# query_salesforce_crm_campaign_influence

Retrieve campaign influence records showing attributed revenue, influence weights by model, and audit trail for multi-touch attribution validation.

- **Kind:** query
- **Source system:** [Salesforce CRM](/systems/salesforce-crm.md)

## Inputs

- campaign_id

## Outputs

- influence_records
- attributed_revenue

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
- [attribution_modeling](/workflow/attribution-modeling.md)
- [roi_narrative_generation](/workflow/roi-narrative-generation.md)
- [reporting_dashboards](/workflow/reporting-dashboards.md)

## Evals

- [Generate this week's ROI narrative for campaigns launched in Q1, including multi-touch attribution, CAC by channel, and investment recommendations if pipeline velocity falls below benchmark.](/tests/weekly-roi-narrative-full-workflow.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- campaign_id

## Produces

- influence_records
- attributed_revenue

# Examples

```
query_salesforce_crm_campaign_influence(campaign_id=<campaign_id>)
```

# Citations

- [Salesforce CRM](/systems/salesforce-crm.md)
