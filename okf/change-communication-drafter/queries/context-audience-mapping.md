---
type: Query Capability
title: Ingest change event details from Workday. Map affected populations into stake...
description: Ingest change event details from Workday. Map affected populations into stakeholder tiers with specific messaging needs and communication channels.
source_id: "context-audience-mapping"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest change event details from Workday. Map affected populations into stakeholder tiers with specific messaging needs and communication channels.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_change_communication_drafter_policy_handbook](/tools/lookup-change-communication-drafter-policy-handbook.md)

## Runs in

- [context_audience_mapping](/workflow/context-audience-mapping.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Change Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-communication-drafter-end-to-end.md)

# Citations

- [Change Communication Drafter Policy Handbook](/documents/change-communication-drafter-policy-handbook.md)
