---
okf_version: "0.1"
type: Knowledge Bundle
title: POS Exception Triage Agent
description: Detects failing registers from Xstore telemetry and opens enriched Zendesk tickets before the store calls. Recommends the proven fix from historical resolution patterns and walks the associate through it. so the Store Manager can move the Register downtime per store/month KPI.
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
provenance_created_at: "2026-07-04T04:05:23.806Z"
---

# POS Exception Triage Agent

> R-1305 • Store Operations

## Overview

- **Persona:** Store Manager
- **Department:** retail
- **Objective:** Detects failing registers from Xstore telemetry and opens enriched Zendesk tickets before the store calls. Recommends the proven fix from historical resolution patterns and walks the associate through it. so the Store Manager can move the Register downtime per store/month KPI.

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
