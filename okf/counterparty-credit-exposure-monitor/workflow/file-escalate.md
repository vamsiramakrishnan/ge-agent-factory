---
type: Workflow Stage
title: "File & Escalate"
description: "Execute action_murex_mx_3_file to record the resolution or limit action in Murex MX.3 with a full audit trail, or route the case to the Counterparty Risk Manager, market risk committee, ALCO chair, or counterparty credit risk officer per the escalation rules."
source_id: file_escalate
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# File & Escalate

Execute action_murex_mx_3_file to record the resolution or limit action in Murex MX.3 with a full audit trail, or route the case to the Counterparty Risk Manager, market risk committee, ALCO chair, or counterparty credit risk officer per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)
- [action_murex_mx_3_file](/tools/action-murex-mx-3-file.md)
