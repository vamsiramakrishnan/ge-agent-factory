---
type: Query Capability
title: "Ingest communication brief with topic, audience, tone, and channel preference..."
description: "Ingest communication brief with topic, audience, tone, and channel preferences. Pull brand voice guidelines and audience segmentation data from Workday."
source_id: "brief-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest communication brief with topic, audience, tone, and channel preferences. Pull brand voice guidelines and audience segmentation data from Workday.

## Tools used

- [lookup_employee_communication_drafter_policy_handbook](/tools/lookup-employee-communication-drafter-policy-handbook.md)

## Runs in

- [brief_intake](/workflow/brief-intake.md)

## Evidence expected

- document_reference

## Evals

- [Run the Employee Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-communication-drafter-end-to-end.md)

# Citations

- [Employee Communication Drafter Policy Handbook](/documents/employee-communication-drafter-policy-handbook.md)
