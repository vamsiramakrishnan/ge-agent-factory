---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Parse broker-submitted ACORD applications, loss runs, and SOV spreadsheets and create structured policy_forms and rating_worksheets records in Duck Creek Policy (query_duck_creek_policy_policy_forms) so the submission exists as clean, queryable data instead of an email attachment.](/queries/submission-ingestion-structuring.md)
- [Cross-check policy_forms, rating_worksheets, and endorsement_records for missing mandatory_attachment forms, unfiled form_source combinations, and rating inputs (exposure_base, experience_mod, schedule_mod) that don't reconcile with the submitted exposure basis.](/queries/completeness-consistency-triage.md)
- [Generate a single consolidated information request and open a DocuSign envelope (query_docusign_envelopes) with the correct recipients for any unsigned statutory_notice or application form, then track envelopes and audit_trails to closure instead of chasing brokers by email.](/queries/broker-correspondence-signature-tracking.md)
- [Screen named insureds and beneficial owners, check filing_status/edition_date against the risk's filing_state, and cite the Broker Submission Intake Orchestrator Authority & Referral Guide (lookup_broker_submission_intake_orchestrator_authority_guide) before any recommendation or publish is authorized.](/queries/authority-referral-sanctions-gating.md)
- [Execute action_duck_creek_policy_publish once evidence gates pass, and publish the clean submission dataset to BigQuery analytics_events and historical_metrics (query_bigquery_analytics_events) so submission data entry time and follow-up cycle KPIs stay current for the Underwriting Assistant.](/queries/publish-intake-analytics.md)
