---
okf_version: "0.1"
type: Knowledge Bundle
title: Premium Leakage Detection Analyzer
description: "Continuously cross-reference risk_reports, mvr_records, and prefill_datasets against BigQuery historical_metrics, analytics_events, and cached_aggregates to detect undisclosed exposure and misclassified risk, driving leakage rate on the audited book from 3.9% of written premium to 1.2% while lifting audit hit rate from 18% to 57%."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/premium-leakage-detection-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:11.741Z"
---

# Premium Leakage Detection Analyzer

> I-3505 • Actuarial & Portfolio Risk

## Overview

- **Persona:** Premium Audit Manager
- **Department:** insurance
- **Objective:** Continuously cross-reference risk_reports, mvr_records, and prefill_datasets against BigQuery historical_metrics, analytics_events, and cached_aggregates to detect undisclosed exposure and misclassified risk, driving leakage rate on the audited book from 3.9% of written premium to 1.2% while lifting audit hit rate from 18% to 57%.

## KPI summary

- **Leakage rate on audited book**: 3.9% of written premium → 1.2% of written premium
- **Audit hit rate (audits finding material misstatement)**: 18% → 57%
- **Additional premium recovered annually**: $5.5M → $16.2M

## Contents

- [Playbook — role, scope, guardrails](/playbook.md)
- [Source Systems](/systems/index.md)
- [Data Entities](/tables/index.md)
- [Agent Tools](/tools/index.md)
- [Workflow Stages](/workflow/index.md)
- [Query Capabilities](/queries/index.md)
- [Eval Scenarios](/tests/index.md)
- [Source Documents](/documents/index.md)
- [Claims](/claims/index.md)
- [Policies](/policies/index.md)
- [Proof Obligations](/proof-obligations/index.md)
- [KPIs](/kpis.md)
- [Golden Evals](/evals.md)
