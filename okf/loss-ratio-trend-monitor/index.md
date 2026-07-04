---
okf_version: "0.1"
type: Knowledge Bundle
title: Loss Ratio Trend Monitor
description: "Continuously scans loss ratios across hundreds of state, class, tier, and cohort combinations in BigQuery, benchmarked against Verisk industry trends. Distinguishes credible deterioration from noise using severity, frequency, and large-loss decomposition. so the Chief Actuary can move the Time to detect a deteriorating segment KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/loss-ratio-trend-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:05:01.919Z"
---

# Loss Ratio Trend Monitor

> I-3503 • Actuarial & Portfolio Risk

## Overview

- **Persona:** Chief Actuary
- **Department:** insurance
- **Objective:** Continuously scans loss ratios across hundreds of state, class, tier, and cohort combinations in BigQuery, benchmarked against Verisk industry trends. Distinguishes credible deterioration from noise using severity, frequency, and large-loss decomposition. so the Chief Actuary can move the Time to detect a deteriorating segment KPI.

## KPI summary

- **Time to detect a deteriorating segment**: 4-6 months → 3 weeks
- **Segments monitored continuously**: 12 top-level → 400+ granular
- **Combined ratio impact of late detection**: 1.8 points → 0.4 points

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
