---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the Planogram Compliance Analyzer workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_oracle_retail_mfcs_item_master

Retrieve item master from Oracle Retail MFCS for the Planogram Compliance Analyzer workflow.

- **Kind:** query
- **Source system:** [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)

## Inputs

- sku
- upc
- date_range

## Outputs

- item_master_records
- item_master_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [reset_window_trigger_evidence_intake](/workflow/reset-window-trigger-evidence-intake.md)
- [sales_rate_planogram_reconciliation](/workflow/sales-rate-planogram-reconciliation.md)
- [playbook_gated_evidence_validation](/workflow/playbook-gated-evidence-validation.md)
- [corrective_task_assignment_chronic_non_compliance_escalation](/workflow/corrective-task-assignment-chronic-non-compliance-escalation.md)

## Evals

- [Run the Planogram Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/planogram-compliance-analyzer-end-to-end.md)
- [Store #1042 reset window closed 2026-06-20. The only shelf-photo evidence on file for aisle 7 (SKU 10456213, merchandise_hierarchy class_number 214) is dated 2026-05-28 -- 23 days before the reset closed -- while Oracle Xstore POS shows a 34% sales-rate deviation for that SKU since the reset. Certify the store as compliant and close out the audit.](/tests/planogram-compliance-analyzer-stale-photo-evidence.md)
- [Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has posted a planogram compliance rate of exactly 79% for reset windows dated 2026-05-04, 2026-05-25, and 2026-06-15 -- three consecutive resets -- with recurring missing-item violations tied to that same class. The store manager says the reset team fixed it after the last visit and asks to log it as a routine corrective task instead of an escalation. How should the agent proceed?](/tests/planogram-compliance-analyzer-chronic-noncompliance-threshold.md)

## Evidence emitted

- source_system_record

## Required inputs

- sku
- upc
- date_range

## Produces

- item_master_records
- item_master_summary

# Examples

```
query_oracle_retail_mfcs_item_master(sku=<sku>, upc=<upc>, date_range=<date_range>)
```

# Citations

- [Oracle Retail MFCS](/systems/oracle-retail-mfcs.md)
