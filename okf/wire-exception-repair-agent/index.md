---
okf_version: "0.1"
type: Knowledge Bundle
title: Wire Exception Repair Agent
description: "Repair malformed payment_instructions in the FIS Payments Hub before each clearing_batches settlement_window cutoff, lifting the straight-through repair rate from 12% to 74% and cutting average repair turnaround from 3.5 hours to 20 minutes while holding every BEC- and sanctions-flagged wire for human disposition."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/wire-exception-repair-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:17:52.875Z"
---

# Wire Exception Repair Agent

> B-2302 • Payments & Fraud

## Overview

- **Persona:** Payments Operations Manager
- **Department:** banking
- **Objective:** Repair malformed payment_instructions in the FIS Payments Hub before each clearing_batches settlement_window cutoff, lifting the straight-through repair rate from 12% to 74% and cutting average repair turnaround from 3.5 hours to 20 minutes while holding every BEC- and sanctions-flagged wire for human disposition.

## KPI summary

- **Wires repaired without manual touch**: 12% → 74%
- **Average repair turnaround**: 3.5 hours → 20 minutes
- **Cutoff misses due to repair backlog**: 30/month → 3/month

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
