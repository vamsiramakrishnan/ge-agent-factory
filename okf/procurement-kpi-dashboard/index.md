---
okf_version: "0.1"
type: Knowledge Bundle
title: Procurement KPI Dashboard
description: "Automated daily KPI calculation with threshold-based alerting on significant changes. LLM generates narrative digests explaining root causes: 'Touchless rate dropped due to new supplier onboarded without EDI — temporary, resolves in 2 weeks.' so the CPO can move the Dashboard refresh frequency KPI."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/procurement/ProcurementKPIDashboard.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Procurement KPI Dashboard

> A-1904 • Spend Analytics

## Overview

- **Persona:** CPO
- **Department:** procurement
- **Objective:** Automated daily KPI calculation with threshold-based alerting on significant changes. LLM generates narrative digests explaining root causes: 'Touchless rate dropped due to new supplier onboarded without EDI — temporary, resolves in 2 weeks.' so the CPO can move the Dashboard refresh frequency KPI.

## KPI summary

- **Dashboard refresh frequency**: Monthly manual → Daily automated
- **Ad-hoc data requests**: 10+ per week → 80% self-served
- **Root cause explanation**: None — just numbers → AI-generated narrative

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
