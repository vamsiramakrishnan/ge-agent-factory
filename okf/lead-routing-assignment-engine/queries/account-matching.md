---
type: Query Capability
title: "Fuzzy match lead to existing account hierarchy using company name variants, e..."
description: "Fuzzy match lead to existing account hierarchy using company name variants, email domain, and entity resolution. Score match confidence and flag ambiguous cases."
source_id: "account-matching"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fuzzy match lead to existing account hierarchy using company name variants, email domain, and entity resolution. Score match confidence and flag ambiguous cases.

## Tools used

- [lookup_lead_routing_assignment_engine_playbook](/tools/lookup-lead-routing-assignment-engine-playbook.md)

## Runs in

- [account_matching](/workflow/account-matching.md)

## Evidence expected

- document_reference

## Evals

- [Run the Lead Routing & Assignment Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/lead-routing-assignment-engine-end-to-end.md)

# Citations

- [Lead Routing & Assignment Engine Playbook](/documents/lead-routing-assignment-engine-playbook.md)
