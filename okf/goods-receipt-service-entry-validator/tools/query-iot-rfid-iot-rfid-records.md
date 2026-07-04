---
type: Agent Tool
title: query_iot_rfid_iot_rfid_records
description: "Retrieve iot rfid records from IoT/RFID for the Goods Receipt & Service Entry Validator workflow."
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

# query_iot_rfid_iot_rfid_records

Retrieve iot rfid records from IoT/RFID for the Goods Receipt & Service Entry Validator workflow.

- **Kind:** query
- **Source system:** [IoT/RFID](/systems/iot-rfid.md)

## Inputs

- lookup_key
- date_range

## Outputs

- iot_rfid_records_records
- iot_rfid_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IoT/RFID](/systems/iot-rfid.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [receipt_data_ingestion](/workflow/receipt-data-ingestion.md)

## Evals

- [Run the Goods Receipt & Service Entry Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/goods-receipt-service-entry-validator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- iot_rfid_records_records
- iot_rfid_records_summary

# Examples

```
query_iot_rfid_iot_rfid_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [IoT/RFID](/systems/iot-rfid.md)
