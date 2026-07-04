---
okf_version: "0.1"
type: Knowledge Bundle
title: VaR Limit Breach Triage Monitor
description: "Decompose every Murex MX.3 risk_measures limit breach to the specific trades and positions driving it, cite BigQuery historical_metrics and analytics_events baselines in the root-cause narrative, and cut time from breach to explained root cause from 6 hours to 30 minutes while holding limit excesses aged past the policy escalation deadline at or below 1 per quarter."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/var-limit-breach-triage-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:59.284Z"
---

# VaR Limit Breach Triage Monitor

> B-2602 • Treasury & Market Risk

## Overview

- **Persona:** Market Risk Analyst
- **Department:** banking
- **Objective:** Decompose every Murex MX.3 risk_measures limit breach to the specific trades and positions driving it, cite BigQuery historical_metrics and analytics_events baselines in the root-cause narrative, and cut time from breach to explained root cause from 6 hours to 30 minutes while holding limit excesses aged past the policy escalation deadline at or below 1 per quarter.

## KPI summary

- **Time from breach to explained root cause**: 6 hours → 30 minutes
- **Limit excesses aged past policy deadline**: 12/quarter → 1/quarter
- **Analyst hours on breach paperwork**: 25 hrs/week → 5 hrs/week

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
