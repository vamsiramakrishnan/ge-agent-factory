---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Monitor Airflow DAG executions, dbt model runs, and BigQuery table freshness. Detect failures, timeouts, and data quality violations in real time.](/queries/failure-detection-alerting.md)
- [Trace failure through dependency graph. Identify root cause: upstream schema change, data volume spike, infrastructure issue, or code regression. Check BigQuery information schema for recent changes.](/queries/root-cause-analysis.md)
- [Gemini generates a concrete fix proposal based on root cause. For schema changes: generate dbt model update. For data issues: suggest default values or filtering. Assesses downstream impact of the fix.](/queries/fix-proposal-generation.md)
- [Approved fix deployed to pipeline. Re-run affected DAGs and verify data freshness and quality tests pass. Update pipeline health dashboard.](/queries/fix-deployment-verification.md)
