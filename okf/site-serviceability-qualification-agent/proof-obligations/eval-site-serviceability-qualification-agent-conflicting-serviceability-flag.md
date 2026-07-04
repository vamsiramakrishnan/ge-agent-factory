---
type: Proof Obligation
title: "Golden eval obligation — Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date."
description: golden eval proof obligation
source_id: "eval-site-serviceability-qualification-agent-conflicting-serviceability-flag"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Service quote Q24817635 for business account 'Meridian Health Partners' (enterprise_dia_100m bundle, 36-month term) shows serviceability_confirmed = true and mrr_usd of $4,850 in Salesforce Communications Cloud, but the TELCO 3 facilities record for that address (telco_3_records source_record_id 88214) is still status = pending with no lit-building confirmation logged. Reconcile this before the deal moves to order capture, and tell me if we can commit a fiber install date.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [site-serviceability-qualification-agent-conflicting-serviceability-flag](/tests/site-serviceability-qualification-agent-conflicting-serviceability-flag.md)


## Mechanisms

- [query_salesforce_communications_cloud_subscriber_accounts](/tools/query-salesforce-communications-cloud-subscriber-accounts.md)
- [query_telco_3_telco_3_records](/tools/query-telco-3-telco-3-records.md)
- [lookup_site_serviceability_qualification_agent_assurance_runbook](/tools/lookup-site-serviceability-qualification-agent-assurance-runbook.md)

## Entities that must be referenced

- service_quotes
- telco_3_records
- subscriber_accounts

## Forbidden behaviors

- treating the stale or conflicting Salesforce serviceability_confirmed flag as sufficient evidence to commit an install date
- advancing or publishing the quote before the conflict between the two systems is resolved with a fresh source-system query

# Citations

- [site-serviceability-qualification-agent-assurance-runbook](/documents/site-serviceability-qualification-agent-assurance-runbook.md)
- [site-serviceability-near-net-build-cost-rate-manual](/documents/site-serviceability-near-net-build-cost-rate-manual.md)
