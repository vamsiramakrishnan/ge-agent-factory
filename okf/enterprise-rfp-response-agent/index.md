---
okf_version: "0.1"
type: Knowledge Bundle
title: Enterprise RFP Response Agent
description: "The agent qualifies inbound carrier RFPs against subscriber_accounts and service_quotes, auto-builds the compliance matrix from BigQuery historical_metrics and analytics_events baselines, and routes gaps for SME sign-off, so RFP first-draft time falls from 10 days to 1 day and participation rate rises from 55% to 85% of qualified bids."
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/enterprise-rfp-response-agent.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:41.269Z"
---

# Enterprise RFP Response Agent

> T-4105 • Sales & Customer Acquisition

## Overview

- **Persona:** Bid Manager
- **Department:** telco
- **Objective:** The agent qualifies inbound carrier RFPs against subscriber_accounts and service_quotes, auto-builds the compliance matrix from BigQuery historical_metrics and analytics_events baselines, and routes gaps for SME sign-off, so RFP first-draft time falls from 10 days to 1 day and participation rate rises from 55% to 85% of qualified bids.

## KPI summary

- **RFP first-draft time**: 10 days → 1 day
- **RFP participation rate**: 55% of qualified bids → 85% of qualified bids
- **Bid team overtime hours per RFP**: 60 hours → 12 hours

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
