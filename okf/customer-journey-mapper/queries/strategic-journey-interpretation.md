---
type: Query Capability
title: "Gemini interprets journey patterns strategically. 'Enterprise accounts with 1..."
description: "Gemini interprets journey patterns strategically. 'Enterprise accounts with 10+ stakeholder touches convert at 4x — different personas engaging (technical, business, procurement). Non-converters have repetitive single-person touches. Recommend ABM plays targeting multiple stakeholders.'"
source_id: "strategic-journey-interpretation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets journey patterns strategically. 'Enterprise accounts with 10+ stakeholder touches convert at 4x — different personas engaging (technical, business, procurement). Non-converters have repetitive single-person touches. Recommend ABM plays targeting multiple stakeholders.'

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [lookup_customer_journey_mapper_playbook](/tools/lookup-customer-journey-mapper-playbook.md)
- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [strategic_journey_interpretation](/workflow/strategic-journey-interpretation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Customer Journey Mapper workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/customer-journey-mapper-end-to-end.md)

# Citations

- [Customer Journey Mapper Playbook](/documents/customer-journey-mapper-playbook.md)
