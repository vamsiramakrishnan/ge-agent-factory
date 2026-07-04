---
type: Workflow Stage
title: Evidence Collection
description: "Pull control documentation, approval logs, and transaction samples from AuditBoard and SAP. Match evidence to control objectives."
source_id: evidence_collection
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Evidence Collection

Pull control documentation, approval logs, and transaction samples from AuditBoard and SAP. Match evidence to control objectives.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_sox_control_testing_agent_controls_playbook](/tools/lookup-sox-control-testing-agent-controls-playbook.md)

Next: [Statistical Sampling & Testing](/workflow/statistical-sampling-testing.md)
