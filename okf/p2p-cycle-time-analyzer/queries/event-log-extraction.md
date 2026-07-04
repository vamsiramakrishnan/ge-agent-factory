---
type: Query Capability
title: "Extract process event logs from SAP and Coupa covering the full req-to-pay cy..."
description: "Extract process event logs from SAP and Coupa covering the full req-to-pay cycle. Normalize timestamps and event types into a unified event log for process mining."
source_id: "event-log-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract process event logs from SAP and Coupa covering the full req-to-pay cycle. Normalize timestamps and event types into a unified event log for process mining.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_p2p_cycle_time_analyzer_policy_guide](/tools/lookup-p2p-cycle-time-analyzer-policy-guide.md)
- [action_sap_s_4hana_recommend](/tools/action-sap-s-4hana-recommend.md)

## Runs in

- [event_log_extraction](/workflow/event-log-extraction.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the P2P Cycle Time Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p2p-cycle-time-analyzer-end-to-end.md)

# Citations

- [P2P Cycle Time Analyzer Procurement Policy Guide](/documents/p2p-cycle-time-analyzer-policy-guide.md)
