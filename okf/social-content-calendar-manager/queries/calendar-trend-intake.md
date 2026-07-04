---
type: Query Capability
title: "Sync marketing campaign calendar from HubSpot, pull industry events, monitor ..."
description: "Sync marketing campaign calendar from HubSpot, pull industry events, monitor trending topics. Assemble content themes for the week."
source_id: "calendar-trend-intake"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync marketing campaign calendar from HubSpot, pull industry events, monitor trending topics. Assemble content themes for the week.

## Tools used

- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [lookup_social_content_calendar_manager_playbook](/tools/lookup-social-content-calendar-manager-playbook.md)

## Runs in

- [calendar_trend_intake](/workflow/calendar-trend-intake.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Social Content Calendar Manager workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-content-calendar-manager-end-to-end.md)

# Citations

- [Social Content Calendar Manager Playbook](/documents/social-content-calendar-manager-playbook.md)
