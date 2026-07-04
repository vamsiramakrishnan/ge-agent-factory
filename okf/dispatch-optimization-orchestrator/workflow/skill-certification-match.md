---
type: Workflow Stage
title: "Skill & Certification Match"
description: "Cross-check technician_schedules primary_skill and tower_climb_certified against each field_work_orders work_type, gating any tower-crew or fiber-splicing assignment on the Field Technician Certification & Safety Work Instruction."
source_id: skill_certification_match
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Skill & Certification Match

Cross-check technician_schedules primary_skill and tower_climb_certified against each field_work_orders work_type, gating any tower-crew or fiber-splicing assignment on the Field Technician Certification & Safety Work Instruction.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [action_oracle_field_service_route](/tools/action-oracle-field-service-route.md)

Next: [SLA & Baseline Risk Scoring](/workflow/sla-baseline-risk-scoring.md)
