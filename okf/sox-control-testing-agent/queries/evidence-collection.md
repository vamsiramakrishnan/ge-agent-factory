---
type: Query Capability
title: "Pull control documentation, approval logs, and transaction samples from Audit..."
description: "Pull control documentation, approval logs, and transaction samples from AuditBoard and SAP. Match evidence to control objectives."
source_id: "evidence-collection"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull control documentation, approval logs, and transaction samples from AuditBoard and SAP. Match evidence to control objectives.

## Tools used

- [query_auditboard_auditboard_records](/tools/query-auditboard-auditboard-records.md)
- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [lookup_sox_control_testing_agent_controls_playbook](/tools/lookup-sox-control-testing-agent-controls-playbook.md)

## Runs in

- [evidence_collection](/workflow/evidence-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the SOX Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/sox-control-testing-agent-end-to-end.md)

# Citations

- [SOX Control Testing Agent Controls Playbook](/documents/sox-control-testing-agent-controls-playbook.md)
