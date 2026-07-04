---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in Murex MX.3 with a full audit trail, and escalate exceptions to the Counterparty Risk Manager."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in Murex MX.3 with a full audit trail, and escalate exceptions to the Counterparty Risk Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)
