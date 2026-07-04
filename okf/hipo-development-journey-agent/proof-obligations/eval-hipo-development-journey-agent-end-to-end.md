---
type: Proof Obligation
title: "Golden eval obligation — Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-hipo-development-journey-agent-end-to-end"
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

# Golden eval obligation — Run the HiPo Development Journey Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [hipo-development-journey-agent-end-to-end](/tests/hipo-development-journey-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_mentoring_platform_mentoring_platform_records](/tools/query-mentoring-platform-mentoring-platform-records.md)
- [lookup_hipo_development_journey_agent_policy_handbook](/tools/lookup-hipo-development-journey-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Entities that must be referenced

- employees
- lms_records
- documents
- mentoring_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute assign without two-system evidence

# Citations

- [hipo-development-journey-agent-policy-handbook](/documents/hipo-development-journey-agent-policy-handbook.md)
