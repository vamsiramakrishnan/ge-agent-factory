---
okf_version: "0.1"
type: Knowledge Bundle
title: Overdraft Fee Dispute Triage Agent
description: "Reconstructs the posting sequence and fee history from Temenos Transact and BigQuery for each incoming dispute ticket. Recommends a refund or denial with a written rationale based on fee policy, prior waivers, and relationship depth. so the Retail Banking Service Manager can move the Average dispute resolution time KPI."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/overdraft-fee-dispute-triage-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:40.740Z"
---

# Overdraft Fee Dispute Triage Agent

> B-2103 • Retail Banking & Deposits

## Overview

- **Persona:** Retail Banking Service Manager
- **Department:** banking
- **Objective:** Reconstructs the posting sequence and fee history from Temenos Transact and BigQuery for each incoming dispute ticket. Recommends a refund or denial with a written rationale based on fee policy, prior waivers, and relationship depth. so the Retail Banking Service Manager can move the Average dispute resolution time KPI.

## KPI summary

- **Average dispute resolution time**: 5.5 days → 6 hours
- **Refund decision consistency across branches**: 62% → 96%
- **Disputes handled per FTE per day**: 15 → 70

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
