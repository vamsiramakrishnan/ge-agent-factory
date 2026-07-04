---
type: Proof Obligation
title: "Golden eval obligation — Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-offer-package-modeler-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Offer Package Modeler Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [offer-package-modeler-agent-end-to-end](/tests/offer-package-modeler-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_offer_package_modeler_agent_policy_handbook](/tools/lookup-offer-package-modeler-agent-policy-handbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Entities that must be referenced

- employees
- mercer_records
- radford_records
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute trigger without two-system evidence

# Citations

- [offer-package-modeler-agent-policy-handbook](/documents/offer-package-modeler-agent-policy-handbook.md)
