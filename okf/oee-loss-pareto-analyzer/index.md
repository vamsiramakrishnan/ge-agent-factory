---
okf_version: "0.1"
type: Knowledge Bundle
title: OEE Loss Pareto Analyzer
description: "Decomposes OEE into availability, performance, and quality losses per line, shift, and SKU from MES data in BigQuery on request. Generates a ranked loss Pareto with dollarized impact and highlights the single biggest addressable loss bucket. so the Continuous Improvement Lead can move the OEE KPI."
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
provenance_created_at: "2026-07-04T04:05:06.112Z"
---

# OEE Loss Pareto Analyzer

> M-5103 • Production & Shop Floor

## Overview

- **Persona:** Continuous Improvement Lead
- **Department:** manufacturing
- **Objective:** Decomposes OEE into availability, performance, and quality losses per line, shift, and SKU from MES data in BigQuery on request. Generates a ranked loss Pareto with dollarized impact and highlights the single biggest addressable loss bucket. so the Continuous Improvement Lead can move the OEE KPI.

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
