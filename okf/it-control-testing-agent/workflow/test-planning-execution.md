---
type: Workflow Stage
title: "Test Planning & Execution"
description: "Pull control test procedures from ServiceNow GRC. Execute automated tests against source systems. Collect evidence artifacts — access logs, approval records, configuration snapshots."
source_id: test_planning_execution
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Test Planning & Execution

Pull control test procedures from ServiceNow GRC. Execute automated tests against source systems. Collect evidence artifacts — access logs, approval records, configuration snapshots.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_grc_tickets](/tools/query-servicenow-grc-tickets.md)
- [query_rsa_archer_rsa_archer_records](/tools/query-rsa-archer-rsa-archer-records.md)
- [query_onetrust_onetrust_records](/tools/query-onetrust-onetrust-records.md)
- [lookup_it_control_testing_agent_runbook](/tools/lookup-it-control-testing-agent-runbook.md)
- [action_servicenow_grc_generate](/tools/action-servicenow-grc-generate.md)

Next: [Evidence Scoring](/workflow/evidence-scoring.md)
