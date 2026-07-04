---
type: Workflow Stage
title: "Segment Exhibit Drafting & Dashboard Publication"
description: "Publish segment-level commentary and diagnostic exhibits to Looker dashboards (query_looker_dashboards), highlighting which claims/reserve_lines segments most need actuarial judgment."
source_id: segment_exhibit_drafting_dashboard_publication
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Segment Exhibit Drafting & Dashboard Publication

Publish segment-level commentary and diagnostic exhibits to Looker dashboards (query_looker_dashboards), highlighting which claims/reserve_lines segments most need actuarial judgment.

- **Mode:** sequential
- **Stage:** 5 of 6

## Tools

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_reserve_adequacy_analyzer_authority_guide](/tools/lookup-reserve-adequacy-analyzer-authority-guide.md)
- [action_guidewire_claimcenter_draft](/tools/action-guidewire-claimcenter-draft.md)

Next: [Draft Action & Escalation Routing](/workflow/draft-action-escalation-routing.md)
