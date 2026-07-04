---
okf_version: "0.1"
type: Knowledge Bundle
title: "Cost-per-Query Optimizer"
description: "Gemini identifies the top expensive queries and generates specific optimization instructions daily. LLM recommends partition filters, clustering changes, and materialized views with before/after cost projections. so the Data Platform Lead can move the BigQuery monthly spend KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/CostPerQueryOptimizer.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Cost-per-Query Optimizer

> IT6-05 • Data & AI Platform

## Overview

- **Persona:** Data Platform Lead
- **Department:** it
- **Objective:** Gemini identifies the top expensive queries and generates specific optimization instructions daily. LLM recommends partition filters, clustering changes, and materialized views with before/after cost projections. so the Data Platform Lead can move the BigQuery monthly spend KPI.

## KPI summary

- **BigQuery monthly spend**: Unoptimized growth → 30-40% reduction
- **Full table scan rate**: 35% of queries → <10% with partition filters
- **Optimization identification**: Ad-hoc manual → Daily automated

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
