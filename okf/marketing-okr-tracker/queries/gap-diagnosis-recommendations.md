---
type: Query Capability
title: "Gemini interprets why specific OKRs are off-track by correlating data sources..."
description: "Gemini interprets why specific OKRs are off-track by correlating data sources. Identifies root causes and generates corrective action recommendations."
source_id: "gap-diagnosis-recommendations"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini interprets why specific OKRs are off-track by correlating data sources. Identifies root causes and generates corrective action recommendations.

## Tools used

- [action_salesforce_crm_recommend](/tools/action-salesforce-crm-recommend.md)

## Runs in

- [gap_diagnosis_recommendations](/workflow/gap-diagnosis-recommendations.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the Marketing OKR Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/marketing-okr-tracker-end-to-end.md)

# Citations

- [Marketing OKR Tracker Playbook](/documents/marketing-okr-tracker-playbook.md)
