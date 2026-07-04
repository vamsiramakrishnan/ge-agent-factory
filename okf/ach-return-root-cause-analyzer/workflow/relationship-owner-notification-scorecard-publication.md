---
type: Workflow Stage
title: "Relationship-owner notification & scorecard publication"
description: "Publish the originator return-rate scorecard to Looker dashboards, notify the relationship owner with the projected breach date and recommended validation-control fix, and execute the publish action in FIS Payments Hub with a full audit trail."
source_id: relationship_owner_notification_scorecard_publication
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Relationship-owner notification & scorecard publication

Publish the originator return-rate scorecard to Looker dashboards, notify the relationship owner with the projected breach date and recommended validation-control fix, and execute the publish action in FIS Payments Hub with a full audit trail.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_fis_payments_hub_payment_instructions](/tools/query-fis-payments-hub-payment-instructions.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_ach_return_root_cause_analyzer_compliance_policy](/tools/lookup-ach-return-root-cause-analyzer-compliance-policy.md)
- [action_fis_payments_hub_publish](/tools/action-fis-payments-hub-publish.md)
