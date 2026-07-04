---
type: Query Capability
title: Conversational interface collects leave or accommodation request details from...
description: "Conversational interface collects leave or accommodation request details from employee. Identifies request type, applicable jurisdiction, and required documentation."
source_id: "conversational-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Conversational interface collects leave or accommodation request details from employee. Identifies request type, applicable jurisdiction, and required documentation.

## Tools used

- [lookup_leave_accommodation_intake_agent_policy_handbook](/tools/lookup-leave-accommodation-intake-agent-policy-handbook.md)

## Runs in

- [conversational_intake](/workflow/conversational-intake.md)

## Evidence expected

- document_reference

## Evals

- [Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/leave-accommodation-intake-agent-end-to-end.md)

# Citations

- [Leave & Accommodation Intake Agent Policy Handbook](/documents/leave-accommodation-intake-agent-policy-handbook.md)
