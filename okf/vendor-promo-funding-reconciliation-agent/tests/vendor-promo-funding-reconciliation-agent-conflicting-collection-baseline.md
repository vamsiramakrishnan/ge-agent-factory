---
type: Eval Scenario
title: "For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class '..."
description: "For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class 'carbonated_beverages' (dry_grocery, gmroi_target 2.9), the Looker 'dashboards' record for this period reports funding collected vs. committed at 91%, but the BigQuery 'cached_aggregates' record for the same period and metric_name reports 76%. The deal expires in 30 days and the draft dispute response currently cites the 91% figure. Which number goes in the vendor dispute letter, and can we send it today?"
source_id: "vendor-promo-funding-reconciliation-agent-conflicting-collection-baseline"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For vendor 618204's Q3 scan-based deal covering merchandise_hierarchy class 'carbonated_beverages' (dry_grocery, gmroi_target 2.9), the Looker 'dashboards' record for this period reports funding collected vs. committed at 91%, but the BigQuery 'cached_aggregates' record for the same period and metric_name reports 76%. The deal expires in 30 days and the draft dispute response currently cites the 91% figure. Which number goes in the vendor dispute letter, and can we send it today?

## Validates

- [claim-dispute-drafting](/queries/claim-dispute-drafting.md)

## Mechanisms to call

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_vendor_promo_funding_reconciliation_agent_execution_playbook](/tools/lookup-vendor-promo-funding-reconciliation-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Vendor Promo Funding Reconciliation Agent Retail Execution Playbook](/documents/vendor-promo-funding-reconciliation-agent-execution-playbook.md)
