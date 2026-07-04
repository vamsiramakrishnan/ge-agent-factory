---
okf_version: "0.1"
type: Knowledge Bundle
title: Fraud Rule Tuning Analyzer
description: "Cut Alert volume per $1M protected from 310 to 140 while lifting the fraud detection rate from 61% to 78% by weekly backtesting NICE Actimize fraud_alerts and transaction_risk_scores against confirmed-fraud outcomes in BigQuery, then recommending threshold and retirement changes through action_nice_actimize_recommend on a weekly rather than quarterly cycle."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fraud-rule-tuning-analyzer.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:54.144Z"
---

# Fraud Rule Tuning Analyzer

> B-2305 • Payments & Fraud

## Overview

- **Persona:** Fraud Strategy Manager
- **Department:** banking
- **Objective:** Cut Alert volume per $1M protected from 310 to 140 while lifting the fraud detection rate from 61% to 78% by weekly backtesting NICE Actimize fraud_alerts and transaction_risk_scores against confirmed-fraud outcomes in BigQuery, then recommending threshold and retirement changes through action_nice_actimize_recommend on a weekly rather than quarterly cycle.

## KPI summary

- **Alert volume per $1M protected**: 310 → 140
- **Fraud detection rate**: 61% → 78%
- **Rule-tuning cycle time**: Quarterly → Weekly

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
