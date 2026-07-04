---
type: Query Capability
title: Pull control test procedures from ServiceNow GRC. Execute automated tests aga...
description: "Pull control test procedures from ServiceNow GRC. Execute automated tests against source systems. Collect evidence artifacts — access logs, approval records, configuration snapshots."
source_id: "test-planning-execution"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull control test procedures from ServiceNow GRC. Execute automated tests against source systems. Collect evidence artifacts — access logs, approval records, configuration snapshots.

## Tools used

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [lookup_it_control_testing_agent_runbook](/tools/lookup-it-control-testing-agent-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

## Runs in

- [test_planning_execution](/workflow/test-planning-execution.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the IT Control Testing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-control-testing-agent-end-to-end.md)

# Citations

- [IT Control Testing Agent Operations Runbook](/documents/it-control-testing-agent-runbook.md)
