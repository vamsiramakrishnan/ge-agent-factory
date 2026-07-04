---
okf_version: "0.1"
type: Knowledge Bundle
title: Deposit Attrition Early Warning Monitor
description: "Score every core_accounts deposit relationship weekly against account_transactions balance velocity and standing_orders redirection patterns, reconcile against BigQuery baselines, and publish a ranked retention worklist that lifts at-risk balances identified before outflow from 22% to 68% while raising retention offer response rate from 4% to 14%."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/deposit-attrition-early-warning-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:49.391Z"
---

# Deposit Attrition Early Warning Monitor

> B-2104 • Retail Banking & Deposits

## Overview

- **Persona:** Retail Deposits Product Manager
- **Department:** banking
- **Objective:** Score every core_accounts deposit relationship weekly against account_transactions balance velocity and standing_orders redirection patterns, reconcile against BigQuery baselines, and publish a ranked retention worklist that lifts at-risk balances identified before outflow from 22% to 68% while raising retention offer response rate from 4% to 14%.

## KPI summary

- **At-risk balances identified before outflow**: 22% → 68%
- **Retention offer response rate**: 4% → 14%
- **Time to produce attrition analysis**: 2 weeks → Same day

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
