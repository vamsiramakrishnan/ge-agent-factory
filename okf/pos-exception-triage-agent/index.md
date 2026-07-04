---
okf_version: "0.1"
type: Knowledge Bundle
title: POS Exception Triage Agent
description: "Correlate Oracle Xstore POS register telemetry (pos_transactions, tender_records, store_shift_summaries) with Zendesk tickets and macros to detect and enrich failing-lane incidents before the store calls, driving Register downtime per store/month from 6.5 hours to 1.2 hours and POS incident mean time to resolve from 9 hours to 45 minutes."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/pos-exception-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:32.827Z"
---

# POS Exception Triage Agent

> R-1305 • Store Operations

## Overview

- **Persona:** Store Manager
- **Department:** retail
- **Objective:** Correlate Oracle Xstore POS register telemetry (pos_transactions, tender_records, store_shift_summaries) with Zendesk tickets and macros to detect and enrich failing-lane incidents before the store calls, driving Register downtime per store/month from 6.5 hours to 1.2 hours and POS incident mean time to resolve from 9 hours to 45 minutes.

## KPI summary

- **Register downtime per store/month**: 6.5 hours → 1.2 hours
- **POS incident mean time to resolve**: 9 hours → 45 minutes
- **Repeat incidents from known causes**: 38% → 8%

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
