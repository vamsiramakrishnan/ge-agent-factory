---
okf_version: "0.1"
type: Knowledge Bundle
title: Payment Plan Recommendation Agent
description: "Rank viable installment payment plans for policyholders in real time by re-pricing billing_accounts, premium_invoices, and payment_plans records in Guidewire BillingCenter against BigQuery payment-history baselines, cutting Billing call handle time from 11 minutes toward the 4-minute target while holding installment plan default rate at or below 6%."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/payment-plan-recommendation-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:07.027Z"
---

# Payment Plan Recommendation Agent

> I-3304 • Billing & Payments

## Overview

- **Persona:** Customer Service Representative
- **Department:** insurance
- **Objective:** Rank viable installment payment plans for policyholders in real time by re-pricing billing_accounts, premium_invoices, and payment_plans records in Guidewire BillingCenter against BigQuery payment-history baselines, cutting Billing call handle time from 11 minutes toward the 4-minute target while holding installment plan default rate at or below 6%.

## KPI summary

- **Billing call handle time**: 11 min → 4 min
- **Installment plan default rate**: 14% → 6%
- **First-call resolution on billing inquiries**: 58% → 88%

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
