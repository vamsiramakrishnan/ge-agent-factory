---
type: Query Capability
title: Refresh Looker close analytics dashboards and distribute retrospective report...
description: Refresh Looker close analytics dashboards and distribute retrospective report to accounting leadership.
source_id: "dashboard-distribution"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Refresh Looker close analytics dashboards and distribute retrospective report to accounting leadership.

## Tools used

- [query_blackline_close_tasks](/tools/query-blackline-close-tasks.md)
- [query_bigquery_close_history](/tools/query-bigquery-close-history.md)
- [action_looker_publish_dashboard](/tools/action-looker-publish-dashboard.md)
- [action_email_distribute_retrospective](/tools/action-email-distribute-retrospective.md)
- [evidence_close_cycle_playbook](/tools/evidence-close-cycle-playbook.md)
- [evidence_close_acceleration_sop](/tools/evidence-close-acceleration-sop.md)

## Runs in

- [dashboard_distribution](/workflow/dashboard-distribution.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- document_reference

## Evals

- [Generate a full retrospective for our May 2026 close cycle. We closed in 8.5 days vs. a 7-day target. What bottleneck tasks delayed us, and what are your recommendations?](/tests/full-month-end-retrospective.md)
- [Which close tasks took longer than planned in April 2026, and how much did they delay the overall cycle?](/tests/bottleneck-attribution-only.md)
- [Show me the close cycle trend for the last 2 years.](/tests/insufficient-data-refusal.md)

# Citations

- [Close Cycle Playbook](/documents/close-cycle-playbook.md)
- [Close Acceleration SOP](/documents/close-acceleration-sop.md)
