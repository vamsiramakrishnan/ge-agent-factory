---
type: Agent Tool
title: query_lexisnexis_risk_solutions_risk_reports
description: Retrieve risk reports from LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_lexisnexis_risk_solutions_risk_reports

Retrieve risk reports from LexisNexis Risk Solutions for the Application Fraud Screening Agent workflow.

- **Kind:** query
- **Source system:** [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)

## Inputs

- report_id
- policy_number
- date_range

## Outputs

- risk_reports_records
- risk_reports_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Application Fraud Screening Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/application-fraud-screening-agent-end-to-end.md)

## Evidence emitted

- sql_result

## Required inputs

- report_id
- policy_number
- date_range

## Produces

- risk_reports_records
- risk_reports_summary

# Examples

```
query_lexisnexis_risk_solutions_risk_reports(report_id=<report_id>, policy_number=<policy_number>, date_range=<date_range>)
```

# Citations

- [LexisNexis Risk Solutions](/systems/lexisnexis-risk-solutions.md)
