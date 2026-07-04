---
okf_version: "0.1"
type: Knowledge Bundle
title: Overdraft Fee Dispute Triage Agent
description: "Reconstruct the posting sequence from Temenos Transact account_transactions and standing_orders, score each overdraft-fee ticket in ServiceNow against BigQuery fee-waiver history, and issue a policy-cited refund or denial so the Retail Banking Service Manager cuts average dispute resolution time from 5.5 days to 6 hours while holding refund decision consistency across branches at 96%."
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
provenance_created_at: "2026-07-04T06:17:48.971Z"
---

# Overdraft Fee Dispute Triage Agent

> B-2103 • Retail Banking & Deposits

## Overview

- **Persona:** Retail Banking Service Manager
- **Department:** banking
- **Objective:** Reconstruct the posting sequence from Temenos Transact account_transactions and standing_orders, score each overdraft-fee ticket in ServiceNow against BigQuery fee-waiver history, and issue a policy-cited refund or denial so the Retail Banking Service Manager cuts average dispute resolution time from 5.5 days to 6 hours while holding refund decision consistency across branches at 96%.

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
