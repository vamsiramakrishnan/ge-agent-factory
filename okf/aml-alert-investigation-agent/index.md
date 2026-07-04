---
okf_version: "0.1"
type: Knowledge Bundle
title: AML Alert Investigation Agent
description: "Cut the average investigation time per NICE Actimize fraud_alerts case from 95 minutes to 25 minutes by auto-assembling the investigation_cases file (transaction_risk_scores, counterparty history, and BigQuery baseline evidence) and drafting a citation-backed narrative before the AML Investigator opens the case, while holding QA rework on those narratives at or below 5%."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/aml-alert-investigation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:54.996Z"
---

# AML Alert Investigation Agent

> B-2402 • KYC, AML & Compliance

## Overview

- **Persona:** AML Investigator
- **Department:** banking
- **Objective:** Cut the average investigation time per NICE Actimize fraud_alerts case from 95 minutes to 25 minutes by auto-assembling the investigation_cases file (transaction_risk_scores, counterparty history, and BigQuery baseline evidence) and drafting a citation-backed narrative before the AML Investigator opens the case, while holding QA rework on those narratives at or below 5%.

## KPI summary

- **Average investigation time per alert**: 95 min → 25 min
- **Alert backlog age**: 45 days → 6 days
- **QA rework rate on case narratives**: 19% → 5%

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
