---
type: Eval Scenario
title: Run the Technical SEO Monitor workflow for the current period. Cite the relev...
description: "Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "technical-seo-monitor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [automated-crawl-monitoring](/queries/automated-crawl-monitoring.md)

## Mechanisms to call

- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_screaming_frog_screaming_frog_records](/tools/query-screaming-frog-screaming-frog-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_technical_seo_monitor_playbook](/tools/lookup-technical-seo-monitor-playbook.md)
- [action_google_search_console_generate](/tools/action-google-search-console-generate.md)

## Success rubric

Action generate executed against Google Search Console, with audit-trail entry and SEO/SEM Specialist notified of outcomes.

# Citations

- [Technical SEO Monitor Playbook](/documents/technical-seo-monitor-playbook.md)
