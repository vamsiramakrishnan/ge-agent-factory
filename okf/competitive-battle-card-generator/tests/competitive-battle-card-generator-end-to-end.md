---
type: Eval Scenario
title: Run the Competitive Battle Card Generator workflow for the current period. Ci...
description: "Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "competitive-battle-card-generator-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [intelligence-collection](/queries/intelligence-collection.md)

## Mechanisms to call

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_competitive_battle_card_generator_playbook](/tools/lookup-competitive-battle-card-generator-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Success rubric

Action generate executed against Salesforce CRM, with audit-trail entry and Product Marketing Mgr notified of outcomes.

# Citations

- [Competitive Battle Card Generator Playbook](/documents/competitive-battle-card-generator-playbook.md)
