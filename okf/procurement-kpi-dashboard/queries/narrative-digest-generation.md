---
type: Query Capability
title: "Gemini generates narrative digests explaining root causes of KPI changes — 'T..."
description: "Gemini generates narrative digests explaining root causes of KPI changes — 'Touchless rate dropped due to new supplier without EDI, temporary.' Tailors narrative to audience: CPO gets strategic summary, P2P Ops Manager gets operational detail, category managers get category view."
source_id: "narrative-digest-generation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates narrative digests explaining root causes of KPI changes — 'Touchless rate dropped due to new supplier without EDI, temporary.' Tailors narrative to audience: CPO gets strategic summary, P2P Ops Manager gets operational detail, category managers get category view.

## Tools used

- [action_coupa_generate](/tools/action-coupa-generate.md)

## Runs in

- [narrative_digest_generation](/workflow/narrative-digest-generation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Procurement KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-kpi-dashboard-end-to-end.md)

# Citations

- [Procurement KPI Dashboard Procurement Policy Guide](/documents/procurement-kpi-dashboard-policy-guide.md)
