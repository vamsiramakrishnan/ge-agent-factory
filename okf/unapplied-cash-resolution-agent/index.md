---
okf_version: "0.1"
type: Knowledge Bundle
title: Unapplied Cash Resolution Agent
description: "Resolve lockbox and agency-bulk suspense payments sitting against Guidewire BillingCenter billing_accounts and premium_invoices by fuzzy-matching payer name, amount, and bank data against BigQuery analytics_events history, driving the unapplied cash balance from a $4.7M average down to a $0.6M average while lifting the lockbox auto-match rate to 96%."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/unapplied-cash-resolution-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:07.487Z"
---

# Unapplied Cash Resolution Agent

> I-3305 • Billing & Payments

## Overview

- **Persona:** Cash Applications Specialist
- **Department:** insurance
- **Objective:** Resolve lockbox and agency-bulk suspense payments sitting against Guidewire BillingCenter billing_accounts and premium_invoices by fuzzy-matching payer name, amount, and bank data against BigQuery analytics_events history, driving the unapplied cash balance from a $4.7M average down to a $0.6M average while lifting the lockbox auto-match rate to 96%.

## KPI summary

- **Unapplied cash balance**: $4.7M average → $0.6M average
- **Auto-match rate on lockbox receipts**: 71% → 96%
- **Aged suspense items over 30 days**: 1,900 → 150

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
