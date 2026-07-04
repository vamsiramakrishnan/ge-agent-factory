---
type: Workflow Stage
title: "Risk-Run Breach Detection"
description: "Poll Murex MX.3 risk_measures for limit_breach_flag and limit_utilization_pct crossings as each risk run lands, keyed by desk and measure_type (var_99_1day, stressed_var, dv01, cs01)."
source_id: risk_run_breach_detection
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk-Run Breach Detection

Poll Murex MX.3 risk_measures for limit_breach_flag and limit_utilization_pct crossings as each risk run lands, keyed by desk and measure_type (var_99_1day, stressed_var, dv01, cs01).

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

Next: [Trade & Position Decomposition](/workflow/trade-position-decomposition.md)
