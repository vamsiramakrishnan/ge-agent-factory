---
okf_version: "0.1"
type: Knowledge Bundle
title: Credit Portfolio Concentration Monitor
description: "Continuously aggregate committed and outstanding exposure from nCino loan_applications, credit_memos, and covenant_records against board concentration limits so that 92% of limit breaches are caught before booking, moving the quarterly concentration report from a stale 10-day spreadsheet cycle to a continuously refreshed Looker dashboard."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/credit-portfolio-concentration-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:52.018Z"
---

# Credit Portfolio Concentration Monitor

> B-2205 • Lending & Credit

## Overview

- **Persona:** Credit Portfolio Manager
- **Department:** banking
- **Objective:** Continuously aggregate committed and outstanding exposure from nCino loan_applications, credit_memos, and covenant_records against board concentration limits so that 92% of limit breaches are caught before booking, moving the quarterly concentration report from a stale 10-day spreadsheet cycle to a continuously refreshed Looker dashboard.

## KPI summary

- **Time to produce concentration report**: 10 days → Continuous
- **Limit breaches detected before booking**: 0% → 92%
- **Analyst hours on quarterly portfolio review**: 120 hrs → 20 hrs

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
