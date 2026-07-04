---
type: Source System
title: Apache Airflow
description: "DAG execution status, task logs, dependency graphs"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Apache Airflow

DAG execution status, task logs, dependency graphs

- **Protocol:** REST API
- **Local backing:** alloydb

# Schema

- [apache_airflow_records](/tables/apache-airflow-records.md)
- [apache_airflow_events](/tables/apache-airflow-events.md)
- [apache_airflow_audit_trail](/tables/apache-airflow-audit-trail.md)

## Tools using this system

- [query_apache_airflow_apache_airflow_records](/tools/query-apache-airflow-apache-airflow-records.md)
- [action_apache_airflow_generate](/tools/action-apache-airflow-generate.md)
