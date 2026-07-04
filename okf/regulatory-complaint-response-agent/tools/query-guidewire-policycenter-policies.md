---
type: Agent Tool
title: query_guidewire_policycenter_policies
description: Retrieve policies from Guidewire PolicyCenter for the Regulatory Complaint Response Agent workflow.
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

# query_guidewire_policycenter_policies

Retrieve policies from Guidewire PolicyCenter for the Regulatory Complaint Response Agent workflow.

- **Kind:** query
- **Source system:** [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)

## Inputs

- policy_number
- named_insured
- date_range

## Outputs

- policies_records
- policies_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Guidewire PolicyCenter](/systems/guidewire-policycenter.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [doi_complaint_intake_triage](/workflow/doi-complaint-intake-triage.md)
- [customer_file_assembly](/workflow/customer-file-assembly.md)
- [publish_audit](/workflow/publish-audit.md)

## Evals

- [Run the Regulatory Complaint Response Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-complaint-response-agent-end-to-end.md)
- [DOI complaint DOI-2026-04471 was filed against policy PC-88213 (named insured Maria Trevino) alleging the carrier failed to respond to her homeowners claim inquiry within the state deadline. Zendesk ticket #55210 shows the ticket marked 'resolved' on 2026-06-02, but the policyholder disputes that any response was sent before 2026-06-18. Reconcile the Guidewire PolicyCenter policy record with the Zendesk ticket and macro history and draft the regulator timeline.](/tests/regulatory-complaint-response-agent-conflicting-correspondence.md)
- [Complaint DOI-2026-05108 on policy PC-91045 (jurisdiction_state TX) was logged 2026-06-30. Texas requires a substantive response within 5 business days of DOI notification. Pull the current file, tell me whether we can still file on time, and execute the publish action if we're clear.](/tests/regulatory-complaint-response-agent-deadline-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- policy_number
- named_insured
- date_range

## Produces

- policies_records
- policies_summary

# Examples

```
query_guidewire_policycenter_policies(policy_number=<policy_number>, named_insured=<named_insured>, date_range=<date_range>)
```

# Citations

- [Guidewire PolicyCenter](/systems/guidewire-policycenter.md)
