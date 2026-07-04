---
okf_version: "0.1"
type: Knowledge Bundle
title: Customer Payment Predictor
description: "ML model predicts payment dates at the invoice level with +/- 3 day accuracy, enabling precise liquidity planning. Gemini interprets qualitative signals that explain pattern changes -- ERP migrations, CFO transitions, seasonal industry effects. so the AR Manager / Treasurer can move the Cash forecast accuracy KPI."
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
provenance_origin: deck
provenance_source_ref: "../presentation/src/components/slides/use-cases/finance/CustomerPaymentPredictor.tsx"
provenance_version: "1"
provenance_status: registered
provenance_created_at: "2026-07-01T00:00:00.000Z"
---

# Customer Payment Predictor

> A-2307 - AR & Collections

## Overview

- **Persona:** AR Manager / Treasurer
- **Department:** finance
- **Objective:** ML model predicts payment dates at the invoice level with +/- 3 day accuracy, enabling precise liquidity planning. Gemini interprets qualitative signals that explain pattern changes -- ERP migrations, CFO transitions, seasonal industry effects. so the AR Manager / Treasurer can move the Cash forecast accuracy KPI.

## KPI summary

- **Cash forecast accuracy**: 65-70% → 92%
- **Payment date prediction error**: N/A (no prediction) → +/- 3 days
- **Liquidity buffer required**: $15M (uncertainty) → $5M (confidence)

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
