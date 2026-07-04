---
type: Workflow Stage
title: "Exposure Intake & Baseline Pull"
description: "Query risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to establish the declared exposure baseline (class code, payroll, drivers, mileage) for each policy under review this audit cycle."
source_id: exposure_intake_baseline_pull
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exposure Intake & Baseline Pull

Query risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to establish the declared exposure baseline (class code, payroll, drivers, mileage) for each policy under review this audit cycle.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_lexisnexis_risk_solutions_risk_reports](/tools/query-lexisnexis-risk-solutions-risk-reports.md)
- [lookup_premium_leakage_detection_analyzer_authority_guide](/tools/lookup-premium-leakage-detection-analyzer-authority-guide.md)
- [action_lexisnexis_risk_solutions_publish](/tools/action-lexisnexis-risk-solutions-publish.md)

Next: [Leakage Scoring & Audit Queue Prioritization](/workflow/leakage-scoring-audit-queue-prioritization.md)
