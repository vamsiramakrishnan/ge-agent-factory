---
type: Query Capability
title: "Pull competitive data from CRM (competitor mentions, win/loss), Gong (competi..."
description: "Pull competitive data from CRM (competitor mentions, win/loss), Gong (competitive call analysis), SEMrush (competitor positioning and ad spend), and G2 (comparison data). Aggregate by competitor."
source_id: "intelligence-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull competitive data from CRM (competitor mentions, win/loss), Gong (competitive call analysis), SEMrush (competitor positioning and ad spend), and G2 (comparison data). Aggregate by competitor.

## Tools used

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_competitive_battle_card_generator_playbook](/tools/lookup-competitive-battle-card-generator-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Runs in

- [intelligence_collection](/workflow/intelligence-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-battle-card-generator-end-to-end.md)

# Citations

- [Competitive Battle Card Generator Playbook](/documents/competitive-battle-card-generator-playbook.md)
