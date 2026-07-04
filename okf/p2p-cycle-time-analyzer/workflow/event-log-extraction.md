---
type: Workflow Stage
title: Event Log Extraction
description: "Extract process event logs from SAP and Coupa covering the full req-to-pay cycle. Normalize timestamps and event types into a unified event log for process mining."
source_id: event_log_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Event Log Extraction

Extract process event logs from SAP and Coupa covering the full req-to-pay cycle. Normalize timestamps and event types into a unified event log for process mining.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_p2p_cycle_time_analyzer_policy_guide](/tools/lookup-p2p-cycle-time-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

Next: [Process Mining & Bottleneck Analysis](/workflow/process-mining-bottleneck-analysis.md)
