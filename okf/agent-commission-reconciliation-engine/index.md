---
okf_version: "0.1"
type: Knowledge Bundle
title: Agent Commission Reconciliation Engine
description: "Reconciles every commission line against the governing agency agreement, policy transactions, and premium collections in BigQuery. Flags rate mismatches, missed chargebacks, and duplicate payments before the statement run is released. so the Commission Accountant can move the Commission statement disputes per month KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/agent-commission-reconciliation-engine.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:57.288Z"
---

# Agent Commission Reconciliation Engine

> I-3302 • Billing & Payments

## Overview

- **Persona:** Commission Accountant
- **Department:** insurance
- **Objective:** Reconciles every commission line against the governing agency agreement, policy transactions, and premium collections in BigQuery. Flags rate mismatches, missed chargebacks, and duplicate payments before the statement run is released. so the Commission Accountant can move the Commission statement disputes per month KPI.

## KPI summary

- **Commission statement disputes per month**: 210 → 35
- **Reconciliation close time**: 9 business days → 1.5 business days
- **Commission overpayments recovered**: 38% → 92%

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
