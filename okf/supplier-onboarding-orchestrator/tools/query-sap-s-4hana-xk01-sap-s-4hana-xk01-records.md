---
type: Agent Tool
title: query_sap_s_4hana_xk01_sap_s_4hana_xk01_records
description: Retrieve sap s 4hana xk01 records from SAP S/4HANA (XK01) for the Supplier Onboarding Orchestrator workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_xk01_sap_s_4hana_xk01_records

Retrieve sap s 4hana xk01 records from SAP S/4HANA (XK01) for the Supplier Onboarding Orchestrator workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA (XK01)](/systems/sap-s-4hana-xk01.md)

## Inputs

- lookup_key
- date_range

## Outputs

- sap_s_4hana_xk01_records_records
- sap_s_4hana_xk01_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA (XK01)](/systems/sap-s-4hana-xk01.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [vendor_master_creation_provisioning](/workflow/vendor-master-creation-provisioning.md)

## Evals

- [Run the Supplier Onboarding Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-onboarding-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- sap_s_4hana_xk01_records_records
- sap_s_4hana_xk01_records_summary

# Examples

```
query_sap_s_4hana_xk01_sap_s_4hana_xk01_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA (XK01)](/systems/sap-s-4hana-xk01.md)
