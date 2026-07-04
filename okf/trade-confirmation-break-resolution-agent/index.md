---
okf_version: "0.1"
type: Knowledge Bundle
title: Trade Confirmation Break Resolution Agent
description: "Compares each unmatched confirmation against the Murex MX.3 booking and pinpoints the exact mismatched economic fields. Drafts counterparty chaser messages and routes internal booking-error corrections to the desk via ServiceNow. so the Treasury Operations Analyst can move the Confirmations matched without touch KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/trade-confirmation-break-resolution-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:52.271Z"
---

# Trade Confirmation Break Resolution Agent

> B-2605 • Treasury & Market Risk

## Overview

- **Persona:** Treasury Operations Analyst
- **Department:** banking
- **Objective:** Compares each unmatched confirmation against the Murex MX.3 booking and pinpoints the exact mismatched economic fields. Drafts counterparty chaser messages and routes internal booking-error corrections to the desk via ServiceNow. so the Treasury Operations Analyst can move the Confirmations matched without touch KPI.

## KPI summary

- **Confirmations matched without touch**: 55% → 88%
- **Average break resolution time**: 2.3 days → 4 hours
- **Unconfirmed trades older than 30 days**: 120 → 12

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
