---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query risk_reports, mvr_records, and prefill_datasets from LexisNexis Risk Solutions to establish the declared exposure baseline (class code, payroll, drivers, mileage) for each policy under review this audit cycle.](/queries/exposure-intake-baseline-pull.md)
- [Score each policy's leakage probability and expected recovery using BigQuery analytics_events, historical_metrics, and cached_aggregates variance_pct against the audited-book baseline, then rank the monthly premium audit queue by expected recovery.](/queries/leakage-scoring-audit-queue-prioritization.md)
- [Validate every leakage finding against the Premium Leakage Detection Analyzer Authority & Referral Guide and the Physical Premium Audit Field Procedures & Classification Manual before drafting a recommendation, citing the governing thresholds, classification, and referral sections.](/queries/authority-referral-gate-check.md)
- [Draft pre-audit findings summaries referencing risk_reports condition_narrative, field_inspector notes, hazard_grade, and MVR violation history so the field auditor walks into the site visit with a scoped hypothesis.](/queries/pre-audit-findings-drafting.md)
- [Execute action_lexisnexis_risk_solutions_publish for approved findings, post recovered-premium tracking to Looker dashboards and explore_queries, and emit the generated_audit_trail evidence record for every action taken.](/queries/recovery-publication-audit-trail.md)
