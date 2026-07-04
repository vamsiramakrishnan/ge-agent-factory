---
okf_version: "0.1"
type: Knowledge Bundle
title: Financial Health Assessor
description: "Altman Z-score augmented with ML detects deteriorating financial ratios before credit downgrades. LLM reads 10-K filings and flags 'exploring strategic alternatives' and going concern opinions as distress signals. so the Supplier Risk Analyst can move the Distress signal detection KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/FinancialHealthAssessor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Financial Health Assessor

> A-1303 • Supplier Discovery

## Overview

- **Persona:** Supplier Risk Analyst
- **Department:** procurement
- **Objective:** Altman Z-score augmented with ML detects deteriorating financial ratios before credit downgrades. LLM reads 10-K filings and flags 'exploring strategic alternatives' and going concern opinions as distress signals. so the Supplier Risk Analyst can move the Distress signal detection KPI.

## KPI summary

- **Distress signal detection**: Reactive (after default) → 6-12 months early warning
- **Suppliers monitored**: Top 50 manual → All active suppliers
- **Data sources synthesized**: 1-2 per supplier → 5+ including filings

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
