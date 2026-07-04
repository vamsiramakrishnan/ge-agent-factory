---
okf_version: "0.1"
type: Knowledge Bundle
title: "Accruals & Deferrals Engine"
description: Automated identification of all transactions requiring accrual/deferral treatment. Gemini reads contracts and POs to determine precise accrual amounts including discount terms. so the GL Accountant can move the Accrual accuracy KPI.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/finance/AccrualsDeferralsEngine.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Accruals & Deferrals Engine

> A-2105 • GL & Close

## Overview

- **Persona:** GL Accountant
- **Department:** finance
- **Objective:** Automated identification of all transactions requiring accrual/deferral treatment. Gemini reads contracts and POs to determine precise accrual amounts including discount terms. so the GL Accountant can move the Accrual accuracy KPI.

## KPI summary

- **Accrual accuracy**: 85% within 10% → 97% within 5%
- **Manual accrual entries**: 40+ per close → 5 exceptions
- **Reversal errors**: 3-5 per quarter → Zero

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
