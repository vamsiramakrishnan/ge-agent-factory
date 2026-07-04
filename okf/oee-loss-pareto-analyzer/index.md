---
okf_version: "0.1"
type: Knowledge Bundle
title: OEE Loss Pareto Analyzer
description: "Decompose OEE into availability, performance, and quality losses by line, shift, and SKU using Siemens Opcenter MES production_orders, machine_events, and quality_checks records cross-checked against BigQuery historical_metrics and analytics_events, producing a dollarized loss Pareto in under 5 minutes so Kaizen events move from 40% to 95% data-backed selection while OEE climbs from 71% toward 79%."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/oee-loss-pareto-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:15.113Z"
---

# OEE Loss Pareto Analyzer

> M-5103 • Production & Shop Floor

## Overview

- **Persona:** Continuous Improvement Lead
- **Department:** manufacturing
- **Objective:** Decompose OEE into availability, performance, and quality losses by line, shift, and SKU using Siemens Opcenter MES production_orders, machine_events, and quality_checks records cross-checked against BigQuery historical_metrics and analytics_events, producing a dollarized loss Pareto in under 5 minutes so Kaizen events move from 40% to 95% data-backed selection while OEE climbs from 71% toward 79%.

## KPI summary

- **OEE**: 71% → 79%
- **Time to build a loss Pareto**: 2 days → 5 minutes
- **Kaizen events backed by data**: 40% → 95%

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
