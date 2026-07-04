---
type: Workflow Stage
title: "Crew & Visit Bundling"
description: "Bundle compatible work_type items into a single site visit and match them against technician_schedules, filtering to tower_climb_certified crews at the right garage_location before a bundle is proposed."
source_id: crew_visit_bundling
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Crew & Visit Bundling

Bundle compatible work_type items into a single site visit and match them against technician_schedules, filtering to tower_climb_certified crews at the right garage_location before a bundle is proposed.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [lookup_tower_maintenance_scheduling_engine_assurance_runbook](/tools/lookup-tower-maintenance-scheduling-engine-assurance-runbook.md)

Next: [Power Degradation Triage](/workflow/power-degradation-triage.md)
