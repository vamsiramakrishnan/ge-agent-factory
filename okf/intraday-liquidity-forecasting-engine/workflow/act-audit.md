---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in Murex MX.3 with a full audit trail, and escalate exceptions to the Treasury Manager."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in Murex MX.3 with a full audit trail, and escalate exceptions to the Treasury Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [action_murex_mx_3_publish](/tools/action-murex-mx-3-publish.md)
