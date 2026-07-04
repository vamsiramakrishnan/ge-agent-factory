---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Pull contract terms (pricing schedules, volume commitments, rebate tiers) from CLM. Extract actual PO/invoice data from ERP. Stage both in BigQuery for compliance matching.](/queries/terms-actuals-extraction.md)
- [Pricing compliance analysis comparing contracted price vs. actual invoiced price. Volume commitment tracking against targets. Rebate threshold monitoring and penalty trigger detection using statistical analysis.](/queries/pricing-volume-compliance-analysis.md)
- [Gemini interprets complex pricing structures — index-based adjustments with dead bands and caps — and validates supplier quarterly price adjustment letters. Identifies rebate cliff opportunities: 'At 92% of volume commitment with 45 days left, purchasing 8% more triggers $180K retrospective rebate.' Generates actionable compliance exception reports.](/queries/formula-interpretation-advisory.md)
