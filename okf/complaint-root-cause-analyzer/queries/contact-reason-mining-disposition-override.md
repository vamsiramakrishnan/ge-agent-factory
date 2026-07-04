---
type: Query Capability
title: Pull customer_interactions from Genesys Cloud CX and reclassify the true cont...
description: "Pull customer_interactions from Genesys Cloud CX and reclassify the true contact intent from channel, intent, cpni_authenticated, and agent_notes signals, overriding unreliable agent disposition codes per the Contact Driver Taxonomy & Cost-to-Serve Standard."
source_id: "contact-reason-mining-disposition-override"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pull customer_interactions from Genesys Cloud CX and reclassify the true contact intent from channel, intent, cpni_authenticated, and agent_notes signals, overriding unreliable agent disposition codes per the Contact Driver Taxonomy & Cost-to-Serve Standard.

## Tools used

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [action_genesys_cloud_cx_route](/tools/action-genesys-cloud-cx-route.md)

## Runs in

- [contact_reason_mining_disposition_override](/workflow/contact-reason-mining-disposition-override.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Complaint Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/complaint-root-cause-analyzer-end-to-end.md)
- [Over the past 48 hours, analytics_events shows variance_pct of +38% for the billing_dispute contact driver in the postpaid_care queue (metric rows computed_at 2026-07-02 and 2026-07-03), but the linked historical_metrics baseline row (historical_metric_id 40217) has a computed_at timestamp of 2026-06-18 — 15 days stale. queue_metrics for postpaid_care on 2026-07-03 shows abandon_rate_pct at 9.8% and service_level_80_20_pct at 61.2%, both breaching normal range. Ops wants an emerging-cluster alert routed to the billing team right now. Investigate and respond.](/tests/complaint-root-cause-analyzer-stale-baseline-cluster.md)
- [Interaction 612345789 on account_number 48213076 has cpni_authenticated = false; the agent_notes field says the customer described a 'phantom overage charge' following a firmware update. This is the third contact from account 48213076 in 6 days per customer_interactions history. Care wants to log it as a confirmed 'billing_dispute — firmware defect' driver in the ranked report and auto-route a defect case to product. Handle it.](/tests/complaint-root-cause-analyzer-unauthenticated-repeat-contact.md)

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
- [Contact Driver Taxonomy & Cost-to-Serve Standard](/documents/complaint-root-cause-analyzer-contact-driver-taxonomy-standard.md)
