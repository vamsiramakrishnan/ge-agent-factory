---
type: Proof Obligation
title: "Golden eval obligation — Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-technical-seo-monitor-end-to-end"
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

# Golden eval obligation — Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [technical-seo-monitor-end-to-end](/tests/technical-seo-monitor-end-to-end.md)


## Mechanisms

- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_screaming_frog_screaming_frog_records](/tools/query-screaming-frog-screaming-frog-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_technical_seo_monitor_playbook](/tools/lookup-technical-seo-monitor-playbook.md)
- [action_google_search_console_generate](/tools/action-google-search-console-generate.md)

## Entities that must be referenced

- google_search_console_records
- keyword_rankings
- screaming_frog_records
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [technical-seo-monitor-playbook](/documents/technical-seo-monitor-playbook.md)
