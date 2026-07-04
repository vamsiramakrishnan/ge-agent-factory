---
type: Query Capability
title: "Gemini analyzes free-text survey responses where stakeholders describe pain i..."
description: "Gemini analyzes free-text survey responses where stakeholders describe pain in their own words. Synthesizes quantitative maturity scores with qualitative feedback into a diagnostic narrative. Maps specific gaps to specific agents that address them — connecting maturity deficits to the transformation roadmap."
source_id: "diagnostic-narrative-roadmap"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini analyzes free-text survey responses where stakeholders describe pain in their own words. Synthesizes quantitative maturity scores with qualitative feedback into a diagnostic narrative. Maps specific gaps to specific agents that address them — connecting maturity deficits to the transformation roadmap.

## Tools used

- [query_survey_tools_survey_tools_records](/tools/query-survey-tools-survey-tools-records.md)
- [lookup_procurement_maturity_assessor_policy_guide](/tools/lookup-procurement-maturity-assessor-policy-guide.md)

## Runs in

- [diagnostic_narrative_roadmap](/workflow/diagnostic-narrative-roadmap.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Procurement Maturity Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/procurement-maturity-assessor-end-to-end.md)

# Citations

- [Procurement Maturity Assessor Procurement Policy Guide](/documents/procurement-maturity-assessor-policy-guide.md)
