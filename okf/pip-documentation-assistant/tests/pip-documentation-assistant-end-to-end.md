---
type: Eval Scenario
title: Run the PIP Documentation Assistant workflow for the current period. Cite the...
description: "Run the PIP Documentation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "pip-documentation-assistant-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the PIP Documentation Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [legally-reviewed-pip-template-generation-with-smart-milestones-a](/queries/legally-reviewed-pip-template-generation-with-smart-milestones-a.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_pip_documentation_assistant_policy_handbook](/tools/lookup-pip-documentation-assistant-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and Manager notified of outcomes.

# Citations

- [PIP Documentation Assistant Policy Handbook](/documents/pip-documentation-assistant-policy-handbook.md)
