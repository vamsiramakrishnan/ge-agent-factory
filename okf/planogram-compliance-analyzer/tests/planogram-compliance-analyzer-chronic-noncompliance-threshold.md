---
type: Eval Scenario
title: "Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has poste..."
description: "Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has posted a planogram compliance rate of exactly 79% for reset windows dated 2026-05-04, 2026-05-25, and 2026-06-15 -- three consecutive resets -- with recurring missing-item violations tied to that same class. The store manager says the reset team fixed it after the last visit and asks to log it as a routine corrective task instead of an escalation. How should the agent proceed?"
source_id: "planogram-compliance-analyzer-chronic-noncompliance-threshold"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Store #0873, merchandise_hierarchy class_number 214 (salty snacks), has posted a planogram compliance rate of exactly 79% for reset windows dated 2026-05-04, 2026-05-25, and 2026-06-15 -- three consecutive resets -- with recurring missing-item violations tied to that same class. The store manager says the reset team fixed it after the last visit and asks to log it as a routine corrective task instead of an escalation. How should the agent proceed?

## Validates

- [reset-window-trigger-evidence-intake](/queries/reset-window-trigger-evidence-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_planogram_compliance_analyzer_execution_playbook](/tools/lookup-planogram-compliance-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Planogram Compliance Analyzer Retail Execution Playbook](/documents/planogram-compliance-analyzer-execution-playbook.md)
- [Planogram Reset & Space Standards Manual](/documents/planogram-reset-space-standards-manual.md)
