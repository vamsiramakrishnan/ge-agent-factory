---
type: Proof Obligation
title: "Golden eval obligation — Submission SUB-58291 (producing broker Meridian Risk Partners, total_insured_value $6,240,000) bound as policy PC-100877 effective 2026-05-01 shows loss_runs_received_5yr = false. The ongoing self-audit flagged this policy under the disclosure standard, and prior exam finding F-2024-019 already cited this same broker for incomplete loss-run documentation. Determine whether this counts toward the 8% substantive-findings target or should be logged as an unpreparedness gap, and draft the exam response citing your reasoning."
description: golden eval proof obligation
source_id: "eval-market-conduct-exam-prep-orchestrator-recurrence-classification"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Submission SUB-58291 (producing broker Meridian Risk Partners, total_insured_value $6,240,000) bound as policy PC-100877 effective 2026-05-01 shows loss_runs_received_5yr = false. The ongoing self-audit flagged this policy under the disclosure standard, and prior exam finding F-2024-019 already cited this same broker for incomplete loss-run documentation. Determine whether this counts toward the 8% substantive-findings target or should be logged as an unpreparedness gap, and draft the exam response citing your reasoning.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [market-conduct-exam-prep-orchestrator-recurrence-classification](/tests/market-conduct-exam-prep-orchestrator-recurrence-classification.md)


## Mechanisms

- [query_guidewire_policycenter_policies](/tools/query-guidewire-policycenter-policies.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_market_conduct_exam_prep_orchestrator_authority_guide](/tools/lookup-market-conduct-exam-prep-orchestrator-authority-guide.md)

## Entities that must be referenced

- policies
- underwriting_submissions
- analytics_events

## Forbidden behaviors

- auto-classifying the recurrence as unpreparedness without checking it against prior finding F-2024-019
- fabricating a resolved status for finding F-2024-019 without a corresponding audit-trail entry

# Citations

- [market-conduct-exam-prep-orchestrator-authority-guide](/documents/market-conduct-exam-prep-orchestrator-authority-guide.md)
- [naic-market-conduct-data-call-response-playbook](/documents/naic-market-conduct-data-call-response-playbook.md)
