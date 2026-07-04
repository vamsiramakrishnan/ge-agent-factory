---
type: Workflow Stage
title: "Conservation Action Publish & Dashboard Refresh"
description: "Publish the top three conservation actions with quantified kWh and dollar savings via action_sphera_ehs_publish, with the audit trail attached, and refresh the intensity trend view in Looker dashboards for the Sustainability Lead."
source_id: conservation_action_publish_dashboard_refresh
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Conservation Action Publish & Dashboard Refresh

Publish the top three conservation actions with quantified kWh and dollar savings via action_sphera_ehs_publish, with the audit trail attached, and refresh the intensity trend view in Looker dashboards for the Sustainability Lead.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sphera_ehs_safety_incidents](/tools/query-sphera-ehs-safety-incidents.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_energy_intensity_monitoring_engine_sop](/tools/lookup-energy-intensity-monitoring-engine-sop.md)
- [action_sphera_ehs_publish](/tools/action-sphera-ehs-publish.md)
