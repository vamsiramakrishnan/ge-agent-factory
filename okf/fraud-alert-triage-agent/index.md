---
okf_version: "0.1"
type: Knowledge Bundle
title: Fraud Alert Triage Agent
description: "Triage NICE Actimize fraud_alerts and transaction_risk_scores against BigQuery historical baselines and analytics_events so the Fraud Operations Analyst cuts the false-positive alert rate from 94% to 68% and average alert handling time from 18 minutes to 4 minutes, while routing confirmed-fraud alerts to ServiceNow with a pre-built case file."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/fraud-alert-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:52.457Z"
---

# Fraud Alert Triage Agent

> B-2301 • Payments & Fraud

## Overview

- **Persona:** Fraud Operations Analyst
- **Department:** banking
- **Objective:** Triage NICE Actimize fraud_alerts and transaction_risk_scores against BigQuery historical baselines and analytics_events so the Fraud Operations Analyst cuts the false-positive alert rate from 94% to 68% and average alert handling time from 18 minutes to 4 minutes, while routing confirmed-fraud alerts to ServiceNow with a pre-built case file.

## KPI summary

- **False-positive alert rate**: 94% → 68%
- **Average alert handling time**: 18 min → 4 min
- **Fraud losses from delayed action**: $2.1M/yr → $700K/yr

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
