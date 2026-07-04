---
okf_version: "0.1"
type: Knowledge Bundle
title: "Permit-to-Work Compliance Monitor"
description: "Cross-checks every active permit_records entry against in-progress safety_incidents and open ServiceNow tickets in real time, verifying atmospheric_test_required and attendant_assigned prerequisites and the issue_date-plus-valid_hours permit clock, so high-risk work performed without a valid permit falls from 6 events per quarter to 0 and the expired-permit catch rate rises from 40% to 98%."
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
provenance_origin: interview
provenance_source_ref: "apps/factory/catalog/interview-specs/permit-to-work-compliance-monitor.json"
provenance_version: "1"
provenance_status: registered
provenance_owner: "vamsiramakrishnan@gmail.com"
provenance_created_at: "2026-07-04T06:18:24.799Z"
---

# Permit-to-Work Compliance Monitor

> M-5601 • EHS & Sustainability

## Overview

- **Persona:** EHS Manager
- **Department:** manufacturing
- **Objective:** Cross-checks every active permit_records entry against in-progress safety_incidents and open ServiceNow tickets in real time, verifying atmospheric_test_required and attendant_assigned prerequisites and the issue_date-plus-valid_hours permit clock, so high-risk work performed without a valid permit falls from 6 events per quarter to 0 and the expired-permit catch rate rises from 40% to 98%.

## KPI summary

- **High-risk work performed without valid permit**: 6 events per quarter → 0 events per quarter
- **Permit audit preparation time**: 4 days → 2 hours
- **Expired permits caught before work continues**: 40% → 98%

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
