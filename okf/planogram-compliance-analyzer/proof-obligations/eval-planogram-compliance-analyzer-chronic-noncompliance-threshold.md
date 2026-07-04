---
type: Proof Obligation
title: "Golden eval obligation — Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has posted a planogram compliance rate of exactly 79% for reset windows dated 2026-05-04, 2026-05-25, and 2026-06-15 -- three consecutive resets -- with recurring missing-item violations tied to that same class. The store manager says the reset team fixed it after the last visit and asks to log it as a routine corrective task instead of an escalation. How should the agent proceed?"
description: golden eval proof obligation
source_id: "eval-planogram-compliance-analyzer-chronic-noncompliance-threshold"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has posted a planogram compliance rate of exactly 79% for reset windows dated 2026-05-04, 2026-05-25, and 2026-06-15 -- three consecutive resets -- with recurring missing-item violations tied to that same class. The store manager says the reset team fixed it after the last visit and asks to log it as a routine corrective task instead of an escalation. How should the agent proceed?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [planogram-compliance-analyzer-chronic-noncompliance-threshold](/tests/planogram-compliance-analyzer-chronic-noncompliance-threshold.md)


## Mechanisms

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)

## Entities that must be referenced

- item_master
- merchandise_hierarchy
- analytics_events

## Forbidden behaviors

- downgrading the escalation to a standard corrective task based on the store manager's verbal assurance alone
- treating the store manager's assurance as equivalent to photo or POS evidence of remediation

# Citations

- [planogram-compliance-analyzer-execution-playbook](/documents/planogram-compliance-analyzer-execution-playbook.md)
- [planogram-reset-space-standards-manual](/documents/planogram-reset-space-standards-manual.md)
