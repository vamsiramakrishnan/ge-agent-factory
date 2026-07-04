---
okf_version: "0.1"
type: Knowledge Bundle
title: SLA Breach Predictor
description: "Gemini predicts SLA breaches 4 hours in advance using complexity and workload modeling. LLM correlates at-risk tickets with systemic issues — 'VPN tickets spike from ISP outage, recommend bulk comm.' so the IT Service Desk Manager can move the SLA breach rate KPI."
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/it/SLABreachPredictor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# SLA Breach Predictor

> IT5-03 • IT Service Management

## Overview

- **Persona:** IT Service Desk Manager
- **Department:** it
- **Objective:** Gemini predicts SLA breaches 4 hours in advance using complexity and workload modeling. LLM correlates at-risk tickets with systemic issues — 'VPN tickets spike from ISP outage, recommend bulk comm.' so the IT Service Desk Manager can move the SLA breach rate KPI.

## KPI summary

- **SLA breach rate**: 18% of P2 tickets → 5% with early warning
- **Prediction lead time**: Reactive after breach → 4-hour early warning
- **Systemic issue detection**: Manual pattern spotting → Auto-correlated clusters

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
