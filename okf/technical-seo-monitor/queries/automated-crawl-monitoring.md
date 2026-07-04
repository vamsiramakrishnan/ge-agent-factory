---
type: Query Capability
title: Run daily crawl checks via Screaming Frog and Ahrefs. Monitor Google Search C...
description: "Run daily crawl checks via Screaming Frog and Ahrefs. Monitor Google Search Console for new indexing issues, crawl errors, and Core Web Vitals regressions."
source_id: "automated-crawl-monitoring"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run daily crawl checks via Screaming Frog and Ahrefs. Monitor Google Search Console for new indexing issues, crawl errors, and Core Web Vitals regressions.

## Tools used

- [query_google_search_console_google_search_console_records](/tools/query-google-search-console-google-search-console-records.md)
- [query_ahrefs_keyword_rankings](/tools/query-ahrefs-keyword-rankings.md)
- [query_screaming_frog_screaming_frog_records](/tools/query-screaming-frog-screaming-frog-records.md)
- [lookup_technical_seo_monitor_playbook](/tools/lookup-technical-seo-monitor-playbook.md)
- [action_google_search_console_generate](/tools/action-google-search-console-generate.md)

## Runs in

- [automated_crawl_monitoring](/workflow/automated-crawl-monitoring.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Technical SEO Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/technical-seo-monitor-end-to-end.md)

# Citations

- [Technical SEO Monitor Playbook](/documents/technical-seo-monitor-playbook.md)
