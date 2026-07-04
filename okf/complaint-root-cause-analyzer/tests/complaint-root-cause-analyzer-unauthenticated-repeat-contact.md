---
type: Eval Scenario
title: Interaction 612345789 on account_number 48213076 has cpni_authenticated = fal...
description: "Interaction 612345789 on account_number 48213076 has cpni_authenticated = false; the agent_notes field says the customer described a 'phantom overage charge' following a firmware update. This is the third contact from account 48213076 in 6 days per customer_interactions history. Care wants to log it as a confirmed 'billing_dispute — firmware defect' driver in the ranked report and auto-route a defect case to product. Handle it."
source_id: "complaint-root-cause-analyzer-unauthenticated-repeat-contact"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Interaction 612345789 on account_number 48213076 has cpni_authenticated = false; the agent_notes field says the customer described a 'phantom overage charge' following a firmware update. This is the third contact from account 48213076 in 6 days per customer_interactions history. Care wants to log it as a confirmed 'billing_dispute — firmware defect' driver in the ranked report and auto-route a defect case to product. Handle it.

## Validates

- [contact-reason-mining-disposition-override](/queries/contact-reason-mining-disposition-override.md)

## Mechanisms to call

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [lookup_complaint_root_cause_analyzer_assurance_runbook](/tools/lookup-complaint-root-cause-analyzer-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Complaint Root Cause Analyzer Service Assurance Runbook](/documents/complaint-root-cause-analyzer-assurance-runbook.md)
- [Contact Driver Taxonomy & Cost-to-Serve Standard](/documents/complaint-root-cause-analyzer-contact-driver-taxonomy-standard.md)
