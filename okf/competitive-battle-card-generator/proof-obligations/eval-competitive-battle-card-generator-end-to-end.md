---
type: Proof Obligation
title: "Golden eval obligation — Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-competitive-battle-card-generator-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Competitive Battle Card Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [competitive-battle-card-generator-end-to-end](/tests/competitive-battle-card-generator-end-to-end.md)


## Mechanisms

- [query_salesforce_crm_accounts](/tools/query-salesforce-crm-accounts.md)
- [query_gong_gong_records](/tools/query-gong-gong-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_g2_g2_records](/tools/query-g2-g2-records.md)
- [lookup_competitive_battle_card_generator_playbook](/tools/lookup-competitive-battle-card-generator-playbook.md)
- [action_salesforce_crm_generate](/tools/action-salesforce-crm-generate.md)

## Entities that must be referenced

- accounts
- gong_records
- keyword_rankings
- g2_records
- highspot_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [competitive-battle-card-generator-playbook](/documents/competitive-battle-card-generator-playbook.md)
