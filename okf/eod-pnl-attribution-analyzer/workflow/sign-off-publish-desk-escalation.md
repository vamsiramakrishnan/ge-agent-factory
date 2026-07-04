---
type: Workflow Stage
title: "Sign-Off Publish & Desk Escalation"
description: "Publish the attribution pack to Looker dashboards, execute action_murex_mx_3_publish with a full audit trail, and escalate any desk whose unexplained P&L remains above threshold to the Product Control Analyst."
source_id: sign_off_publish_desk_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Sign-Off Publish & Desk Escalation

Publish the attribution pack to Looker dashboards, execute action_murex_mx_3_publish with a full audit trail, and escalate any desk whose unexplained P&L remains above threshold to the Product Control Analyst.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_eod_pnl_attribution_analyzer_compliance_policy](/tools/lookup-eod-pnl-attribution-analyzer-compliance-policy.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)
