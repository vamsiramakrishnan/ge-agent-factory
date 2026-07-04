---
okf_version: "0.1"
type: Knowledge Bundle
title: B2B Quote Configuration Agent
description: "The agent assembles a validated multi-site quote from service_quotes and subscriber_accounts, gating every line on serviceability_confirmed and credit_check_status and applying discount_pct within the approved band, so Quote turnaround time falls from 4.5 days to 6 hours and configuration error rate drops from 12% to 2%."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/b2b-quote-configuration-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:39.592Z"
---

# B2B Quote Configuration Agent

> T-4101 • Sales & Customer Acquisition

## Overview

- **Persona:** B2B Sales Engineer
- **Department:** telco
- **Objective:** The agent assembles a validated multi-site quote from service_quotes and subscriber_accounts, gating every line on serviceability_confirmed and credit_check_status and applying discount_pct within the approved band, so Quote turnaround time falls from 4.5 days to 6 hours and configuration error rate drops from 12% to 2%.

## KPI summary

- **Quote turnaround time**: 4.5 days → 6 hours
- **Quote configuration error rate**: 12% → 2%
- **Quote-to-order conversion**: 31% → 44%

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
