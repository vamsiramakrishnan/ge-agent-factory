# Simulator Archetypes

Use the closest archetype unless the user gives a stronger domain model. Confirm only when a system could plausibly map to multiple families.

Run this command for the source-of-truth machine-readable catalog:

```bash
npm run generator:scaffold-simulator -- --list-archetypes true
```

## Archetype Map

| Archetype | Example Systems | Primary Collections | Starter Behaviors |
| --- | --- | --- | --- |
| `hr_talent` | Workday, SAP SuccessFactors | workers, positions, supervisory_orgs, job_requisitions, worker_events, approvals | worker lookup, job change, manager approval, audit |
| `recruiting` | Greenhouse, ATS, Lever | candidates, jobs, applications, interviews, offers, approvals | application review, interview scheduling, offer approval |
| `learning` | LMS, Cornerstone, Degreed | learners, courses, enrollments, certifications, skills | enrollment update, certification tracking, compliance audit |
| `benefits` | Benefits Platform, ADP benefits | employees, dependents, benefit_plans, enrollments, life_events, approvals | eligibility lookup, life-event review, enrollment update |
| `procurement` | Coupa, Ariba, Jaggaer | suppliers, purchase_orders, requisitions, contracts, approvals, audit_events | supplier search, requisition approval, PO/contract review |
| `supply_chain` | Supplier Portal, Resilinc, Everstream | suppliers, materials, shipments, purchase_orders, inventory_positions, risk_events | shipment update, inventory exception, supplier risk review |
| `erp_finance` | SAP S/4HANA FI, Oracle ERP, NetSuite | vendors, invoices, journal_entries, payments, approvals | invoice review, journal approval, payment status |
| `planning_epm` | Anaplan, SAP BPC, Adaptive | planning_models, scenarios, forecast_lines, budget_owners, approvals | forecast update, budget approval, variance audit |
| `tax_treasury` | Kyriba, HighRadius, Avalara | bank_accounts, payment_batches, cash_positions, tax_filings, approvals | payment release, cash review, tax filing status |
| `crm` | Salesforce, HubSpot, Dynamics CRM | accounts, contacts, opportunities, activities, campaigns | account search, opportunity review, activity logging |
| `marketing_automation` | Marketo, Salesforce Marketing Cloud, 6sense | leads, accounts, campaigns, journeys, email_events, segments | lead review, campaign activation, segment sync |
| `digital_analytics` | GA4, Google Ads, Search Console | properties, events, conversions, audiences, experiments | conversion review, audience update, experiment status |
| `clm` | Icertis, DocuSign CLM, Agiloft | agreements, clauses, obligations, amendments, approvals | agreement lookup, clause review, obligation tracking |
| `identity` | Okta, Entra ID, SailPoint | users, groups, applications, entitlements, access_requests, approvals | access search, entitlement request, approval audit |
| `itsm` | ServiceNow, Jira Service Management | tickets, cmdb_items, changes, slas, approvals | incident triage, request fulfillment, change approval |
| `security` | CrowdStrike, Qualys, Snyk, ServiceNow GRC | assets, findings, incidents, controls, exceptions, approvals | finding triage, incident update, exception approval |
| `observability` | Datadog, Splunk, PagerDuty | services, monitors, alerts, incidents, slos | alert triage, incident status, SLO review |
| `project_work` | Jira, Asana, GitHub Issues | projects, issues, tasks, sprints, releases, approvals | issue triage, task update, release approval |
| `risk_grc` | AuditBoard, RSA Archer, OneTrust | risks, controls, issues, policies, assessments, approvals | control attestation, issue remediation, policy exception |
| `content_cms` | Contentful, WordPress, Bynder | assets, content_items, workflow_tasks, campaigns, approvals | content review, publishing approval, asset sync |
| `collaboration_docs` | Google Drive, SharePoint, Confluence | workspaces, documents, comments, tasks, approvals | document search, comment review, task update |
| `data_platform` | BigQuery, dbt, Airflow | datasets, tables, pipelines, jobs, quality_checks | pipeline update, job status, quality exception |
| `external_intelligence` | D&B, Bloomberg, G2, OFAC, World-Check | companies, signals, watchlists, risk_scores, source_feeds | signal review, watchlist update, score refresh |

## Selection Rules

- Pick an operational archetype when agents must mutate state or reason over permissions, approvals, lifecycle transitions, and audit.
- Pick `collaboration_docs` for document stores where state is mostly review/comment/task workflow.
- Pick `external_intelligence` for third-party feeds that should look like refreshed signals rather than transactional records.
- Pick `data_platform` for warehouse, pipeline, freshness, and data-quality simulation.
- Pick the narrower HR/finance/marketing/security archetype before falling back to `project_work` or `collaboration_docs`.

## Realism Levels

- `starter`: small pack, generic read/update tools, simple workflow catalog, deterministic seed.
- `enterprise`: richer schema, more workflow handlers, approval blockers, role gates, integration failure modes.
- `fortune_500`: multi-region, multi-entity, role/security model, stale reads, high-volume Snowfakery scale, cross-system references, eval scenarios.

## Workflow Expectations

The scaffolder emits `workflows.json` with generic primitives:

- `role_permission_gate`
- `state_machine`
- `approval_blocker`
- `audit_trail`

When improving a pack, extend these declaratively first. Add custom runtime code only when a workflow needs real domain side effects, such as creating Workday business process steps, enforcing ServiceNow change dependencies, balancing ERP ledger entries, or expanding identity group inheritance.
