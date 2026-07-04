---
type: Query Capability
title: "LLM interprets ambiguous free-text descriptions ('need the same thing we orde..."
description: "LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor."
source_id: "intent-resolution-enrichment"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM interprets ambiguous free-text descriptions ('need the same thing we ordered last quarter for Chicago but in blue') and resolves to specific material, supplier, and contract. Detects compliance risks — a requisition for 'consulting services' with a named individual flagged as contingent labor.

## Tools used

- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)

## Runs in

- [intent_resolution_enrichment](/workflow/intent-resolution-enrichment.md)

## Evidence expected

- document_reference

## Evals

- [Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-smart-routing-end-to-end.md)

# Citations

- [Requisition Intake & Smart Routing Procurement Policy Guide](/documents/requisition-intake-smart-routing-policy-guide.md)
