---
okf_version: "0.1"
type: Knowledge Bundle
title: Premium Delinquency Outreach Agent
description: "Scores every past-due account nightly on cure likelihood using payment history and policy tenure in BigQuery. Sends personalized, channel-appropriate reminders through Salesforce Marketing Cloud, including one-tap payment links and card-update prompts. so the Billing Operations Analyst can move the Cure rate before cancellation KPI."
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/premium-delinquency-outreach-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T04:04:56.845Z"
---

# Premium Delinquency Outreach Agent

> I-3301 • Billing & Payments

## Overview

- **Persona:** Billing Operations Analyst
- **Department:** insurance
- **Objective:** Scores every past-due account nightly on cure likelihood using payment history and policy tenure in BigQuery. Sends personalized, channel-appropriate reminders through Salesforce Marketing Cloud, including one-tap payment links and card-update prompts. so the Billing Operations Analyst can move the Cure rate before cancellation KPI.

## KPI summary

- **Cure rate before cancellation**: 54% → 81%
- **Policies lapsing for non-payment**: 6.8% monthly → 2.4% monthly
- **Manual dunning calls per analyst per day**: 40 → 8

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
