---
okf_version: "0.1"
type: Knowledge Bundle
title: Quality Incident Analyzer
description: "LLM reads inspector narratives: 'surface finish appears rough with visible tool marks — possible worn tooling or incorrect feed rate' and reasons about root cause hypotheses. Cross-references recent NCRs: 'Third surface finish complaint in 6 months, same machine center — supplier CAPA said replaced tooling but recurrence suggests spindle wear or coolant system degradation.' so the Quality Engineer can move the Root cause accuracy KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/QualityIncidentAnalyzer.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Quality Incident Analyzer

> A-1702 • Supplier Performance

## Overview

- **Persona:** Quality Engineer
- **Department:** procurement
- **Objective:** LLM reads inspector narratives: 'surface finish appears rough with visible tool marks — possible worn tooling or incorrect feed rate' and reasons about root cause hypotheses. Cross-references recent NCRs: 'Third surface finish complaint in 6 months, same machine center — supplier CAPA said replaced tooling but recurrence suggests spindle wear or coolant system degradation.' so the Quality Engineer can move the Root cause accuracy KPI.

## KPI summary

- **Root cause accuracy**: 60% keyword-based → 92% context-aware
- **CAPA response time**: 5-7 days → Same day
- **Recurrence detection**: Missed patterns → Cross-incident linking

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
