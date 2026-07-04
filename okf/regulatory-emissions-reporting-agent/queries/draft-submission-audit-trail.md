---
type: Query Capability
title: Execute action_sphera_ehs_draft to generate the Title V/NSPS submission packa...
description: "Execute action_sphera_ehs_draft to generate the Title V/NSPS submission package with calculation lineage attached, log the generated_audit_trail, and route the package to the Environmental Compliance Specialist for review and sign-off."
source_id: "draft-submission-audit-trail"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Execute action_sphera_ehs_draft to generate the Title V/NSPS submission package with calculation lineage attached, log the generated_audit_trail, and route the package to the Environmental Compliance Specialist for review and sign-off.

## Tools used

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [action_sphera_ehs_draft](/tools/action-sphera-ehs-draft.md)

## Runs in

- [draft_submission_audit_trail](/workflow/draft-submission-audit-trail.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Regulatory Emissions Reporting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/regulatory-emissions-reporting-agent-end-to-end.md)

# Citations

- [Regulatory Emissions Reporting Agent Standard Operating Procedure](/documents/regulatory-emissions-reporting-agent-sop.md)
- [Title V Deviation Reporting & Emission Factor Rate Manual](/documents/title-v-deviation-reporting-rate-manual.md)
