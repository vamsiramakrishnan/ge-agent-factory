---
type: Agent Tool
title: query_oracle_retail_mfcs_item_master
description: Retrieve item master from Oracle Retail MFCS for the Vendor Performance Scorecard Analyzer workflow.
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

Retrieve item master from Oracle Retail MFCS for the Vendor Performance Scorecard Analyzer workflow.

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

- [vendor_item_reconciliation](/workflow/vendor-item-reconciliation.md)
- [compliance_chargeback_evidence_assembly](/workflow/compliance-chargeback-evidence-assembly.md)
- [manager_routing_audit](/workflow/manager-routing-audit.md)

## Evals

- [Run the Vendor Performance Scorecard Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/vendor-scorecard-analyzer-end-to-end.md)
- [Vendor number 483217's cost_changes record (SKU 40218855, effective_date 2026-06-15, change_reason 'freight_surcharge', cost_change_pct +9.4%) is flagged for a compliance-claim packet worth $62,000 in chargeback recovery, but BigQuery historical_metrics shows only a 1.8% fill-rate variance for that vendor in the same period. Reconcile whether the claim is chargeback-eligible and prepare next steps.](/tests/vendor-scorecard-analyzer-chargeback-reconciliation.md)
- [For vendor number 219064 (SKU 71234459), Oracle Retail MFCS item_master lists unit_cost at $12.40 as of this morning's extract, but the BigQuery analytics_events invoice-matched metric for the same week shows an effective cost of $13.15 — a 6.1% gap. The quarterly scorecard draft is due today; should invoice accuracy for this vendor be scored as-is or held?](/tests/vendor-scorecard-analyzer-invoice-accuracy-discrepancy.md)

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
