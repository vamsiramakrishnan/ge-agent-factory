---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Capture the incoming certificate holder request (holder name, additional-insured wording, project reference) and match it to the correct in-force policy_forms and endorsement_records for that named insured in Duck Creek Policy.](/queries/holder-request-intake-policy-match.md)
- [Pull the current rating_worksheets and any active endorsement_records from Duck Creek Policy to confirm live coverage limits, form_code applicability, and whether a requested additional-insured or waiver-of-subrogation status is actually endorsed onto the policy before any wording is populated.](/queries/coverage-limits-verification.md)
- [Cross-check the requested certificate holder wording, additional-insured status, and any non-ACORD manuscript language against the Certificate of Insurance Issuance Agent Authority & Referral Guide and the COI Wording & ACORD Forms Rate Manual, flagging anything outside pre-approved language for referral.](/queries/wording-authority-gating.md)
- [Auto-populate the ACORD 25 (or applicable ACORD form_code) from the verified Duck Creek Policy data, route the envelope through DocuSign for delivery to the certificate holder, and record recipients and audit_trails for the transaction.](/queries/acord-generation-docu-sign-delivery.md)
- [Escalate non-standard wording or additional-insured requests via action_duck_creek_policy_escalate to an authorized reviewer, and reconcile COI issuance turnaround and error-rate KPIs against analytics_events and historical_metrics in BigQuery.](/queries/escalation-kpi-reconciliation.md)
