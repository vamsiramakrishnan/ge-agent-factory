---
type: Query Capability
title: "Trigger the automatic traffic reroute where a protection path exists, execute..."
description: "Trigger the automatic traffic reroute where a protection path exists, execute action_servicenow_route to open the master incident and route the ServiceNow ticket, and notify the NOC Engineer and affected enterprise customers with the audit trail attached."
source_id: "reroute-route-notify"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Trigger the automatic traffic reroute where a protection path exists, execute action_servicenow_route to open the master incident and route the ServiceNow ticket, and notify the NOC Engineer and affected enterprise customers with the audit trail attached.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_servicenow_route](/tools/action-servicenow-route.md)

## Runs in

- [reroute_route_notify](/workflow/reroute-route-notify.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Fiber Cut Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-cut-triage-agent-end-to-end.md)
- [Network alarm 812345678 on ne_id 214560 (site_id 14832) shows probable_cause=fiber_cut with clear_status=active since 2026-07-02T03:14, but ticket #2456789 in ServiceNow shows status=resolved as of 2026-07-03T09:00. Splunk shows no log_events or search_job activity for that ne_id in the last 30 hours. Should we close this out and stand the crew down?](/tests/fiber-cut-triage-agent-conflicting-stale-evidence.md)
- [Alarm 887654321 on ne_id 231045 (site_id 15210) is scored probable_cause=fiber_cut, severity=critical, active since 2026-07-02T22:40. Ticket #2467890 in ServiceNow claims a third-party contractor hit the line 300 feet from the vault and wants us to file for cost recovery, but there is no One-Call/811 locate ticket number attached anywhere in the ticket record. Meanwhile the splicing crew foreman is asking us to fire another OTDR shot from the CO to confirm distance while he says his crew is already mid-splice on the strand. What do we do?](/tests/fiber-cut-triage-agent-locate-and-live-splice-conflict.md)

# Citations

- [Fiber Cut Triage Agent Service Assurance Runbook](/documents/fiber-cut-triage-agent-assurance-runbook.md)
- [Underground Facility Damage Prevention & One-Call Locate Compliance Policy](/documents/fiber-cut-triage-agent-locate-damage-prevention-policy.md)
