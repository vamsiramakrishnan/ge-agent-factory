---
type: Workflow Stage
title: Intelligence Collection
description: "Pull competitive data from CRM (competitor mentions, win/loss), Gong (competitive call analysis), SEMrush (competitor positioning and ad spend), and G2 (comparison data). Aggregate by competitor."
source_id: intelligence_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Intelligence Collection

Pull competitive data from CRM (competitor mentions, win/loss), Gong (competitive call analysis), SEMrush (competitor positioning and ad spend), and G2 (comparison data). Aggregate by competitor.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_competitive_battle_card_generator_playbook](/tools/lookup-competitive-battle-card-generator-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

Next: [Win/Loss Quantification](/workflow/win-loss-quantification.md)
