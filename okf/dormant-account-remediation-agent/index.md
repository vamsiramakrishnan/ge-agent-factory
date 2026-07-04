---
okf_version: "0.1"
type: Knowledge Bundle
title: Dormant Account Remediation Agent
description: "Classify every core_accounts record crossing its state-specific dormancy trigger, reconcile account_transactions and standing_orders activity against BigQuery historical_metrics before filing, and lift Dormant accounts remediated per month from 1,200 to 4,800 while cutting escheatment filing errors from 35 to 3 per quarter."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/dormant-account-remediation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:48.099Z"
---

# Dormant Account Remediation Agent

> B-2101 • Retail Banking & Deposits

## Overview

- **Persona:** Deposit Operations Analyst
- **Department:** banking
- **Objective:** Classify every core_accounts record crossing its state-specific dormancy trigger, reconcile account_transactions and standing_orders activity against BigQuery historical_metrics before filing, and lift Dormant accounts remediated per month from 1,200 to 4,800 while cutting escheatment filing errors from 35 to 3 per quarter.

## KPI summary

- **Dormant accounts remediated per month**: 1,200 → 4,800
- **Escheatment filing errors per quarter**: 35 → 3
- **Manual review hours per week**: 60 hrs → 8 hrs

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
