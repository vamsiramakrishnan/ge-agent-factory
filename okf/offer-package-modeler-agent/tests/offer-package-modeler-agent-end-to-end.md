---
type: Eval Scenario
title: Run the Offer Package Modeler Agent workflow for the current period. Cite the...
description: "Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "offer-package-modeler-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [market-data-assembly](/queries/market-data-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_offer_package_modeler_agent_policy_handbook](/tools/lookup-offer-package-modeler-agent-policy-handbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Success rubric

Action trigger executed against Workday, with audit-trail entry and Comp Manager notified of outcomes.

# Citations

- [Offer Package Modeler Agent Policy Handbook](/documents/offer-package-modeler-agent-policy-handbook.md)
