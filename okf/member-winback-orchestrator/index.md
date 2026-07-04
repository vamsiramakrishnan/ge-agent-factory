---
okf_version: "0.1"
type: Knowledge Bundle
title: "Lapsed Member Win-Back Orchestrator"
description: "Detect every loyalty_id in pos_transactions that has lapsed past the 90-day recency threshold, segment it by inferred lapse reason using Segment segment_records/segment_events and BigQuery historical_metrics, and dispatch the minimal viable win-back journey through Salesforce Marketing Cloud so the Lapsed-member reactivation rate climbs from 2.8% to 9.6% while cost per reactivation falls from $31 to $9."
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/member-winback-orchestrator.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:37.027Z"
---

# Lapsed Member Win-Back Orchestrator

> R-1505 • Customer & Loyalty

## Overview

- **Persona:** Retention Marketing Manager
- **Department:** retail
- **Objective:** Detect every loyalty_id in pos_transactions that has lapsed past the 90-day recency threshold, segment it by inferred lapse reason using Segment segment_records/segment_events and BigQuery historical_metrics, and dispatch the minimal viable win-back journey through Salesforce Marketing Cloud so the Lapsed-member reactivation rate climbs from 2.8% to 9.6% while cost per reactivation falls from $31 to $9.

## KPI summary

- **Lapsed-member reactivation rate**: 2.8% → 9.6%
- **Cost per reactivation**: $31 → $9
- **Second-purchase rate post win-back**: 19% → 41%

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
