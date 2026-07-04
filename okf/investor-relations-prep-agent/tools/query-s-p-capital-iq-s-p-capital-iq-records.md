---
type: Agent Tool
title: query_s_p_capital_iq_s_p_capital_iq_records
description: "Retrieve s p capital iq records from S&P Capital IQ for the Investor Relations Prep Agent workflow."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_s_p_capital_iq_s_p_capital_iq_records

Retrieve s p capital iq records from S&P Capital IQ for the Investor Relations Prep Agent workflow.

- **Kind:** query
- **Source system:** [S&P Capital IQ](/systems/s-p-capital-iq.md)

## Inputs

- lookup_key
- date_range

## Outputs

- s_p_capital_iq_records_records
- s_p_capital_iq_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [S&P Capital IQ](/systems/s-p-capital-iq.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_assembly](/workflow/data-assembly.md)

## Evals

- [Run the Investor Relations Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investor-relations-prep-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- s_p_capital_iq_records_records
- s_p_capital_iq_records_summary

# Examples

```
query_s_p_capital_iq_s_p_capital_iq_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [S&P Capital IQ](/systems/s-p-capital-iq.md)
