---
okf_version: "0.1"
type: Knowledge Bundle
title: "Three-Way Match Exception Handler"
description: "Fuzzy matching auto-resolves 75% of exceptions — qty tolerances, tax rounding, price adjustments within contract bands. LLM reads invoice line descriptions to understand context: 'includes expedited shipping per email approval' triggers a PO change order, not a rejection. so the AP Manager can move the Exception rate KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/ThreeWayMatchExceptionHandler.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Three-Way Match Exception Handler

> A-1503 • Procure-to-Pay

## Overview

- **Persona:** AP Manager
- **Department:** procurement
- **Objective:** Fuzzy matching auto-resolves 75% of exceptions — qty tolerances, tax rounding, price adjustments within contract bands. LLM reads invoice line descriptions to understand context: 'includes expedited shipping per email approval' triggers a PO change order, not a rejection. so the AP Manager can move the Exception rate KPI.

## KPI summary

- **Exception rate**: 25-35% → 5-8%
- **Avg resolution time**: 3-5 days → 4 hours
- **Auto-resolution rate**: 0% → 75% of exceptions

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
