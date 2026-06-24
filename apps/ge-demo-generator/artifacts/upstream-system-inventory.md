# Upstream System Inventory

Generated: 2026-06-06T07:07:04.336Z

Source: `/home/user/fde-agent-factory/apps/ge-demo-generator/src/use-case-source-map.generated.json`

Use cases: 363

Unique upstream systems: 382

## Priority Model

- **tier-1-cross-domain-simulator**: high reuse across departments; build stateful simulator first.
- **tier-2-domain-simulator**: domain-specific but recurring; build reusable simulator packs.
- **tier-3-adapter-template**: create schema/tool templates and generic state models.
- **tier-4-generic-feed-or-fixture**: keep as feed fixtures unless a scenario needs richer behavior.
- **platform-dependency**: first-party/runtime dependency, not a third-party simulator.

## tier-1-cross-domain-simulator

| System | Uses | Family | Departments | Data Kinds | Protocols |
| --- | ---: | --- | --- | --- | --- |
| Workday | 78 | hr-talent | finance, hr, it | analytics_warehouse, document_store, operational_system | REST API, unknown |
| Looker | 51 | platform-google-collaboration | finance, hr, it, marketing, procurement | analytics_warehouse | Looker API, REST API, unknown |
| Slack | 43 | platform-google-collaboration | finance, hr, it, marketing | collaboration_event, document_store | REST API, Slack API, Webhook, unknown |
| SAP S/4HANA FI | 32 | finance-procurement | finance, procurement | operational_system | OData, RFC/BAPI, unknown |
| Salesforce CRM | 31 | crm-marketing | finance, marketing | analytics_warehouse, operational_system | REST API |
| ServiceNow | 31 | it-ops-security | finance, hr, it, procurement | analytics_warehouse, collaboration_event, document_store, operational_system | REST API, unknown |
| Google Docs | 30 | platform-google-collaboration | finance, hr, marketing, procurement | analytics_warehouse, document_store | Workspace API, unknown |
| SAP S/4HANA | 27 | finance-procurement | finance, procurement | analytics_warehouse, operational_system | OData, REST API, RFC/BAPI, unknown |
| Coupa | 24 | finance-procurement | finance, procurement | analytics_warehouse, document_store, operational_system | REST API |
| Google Workspace | 21 | platform-google-collaboration | hr, it, marketing | collaboration_event, document_store | Admin SDK, Workspace API, unknown |

## tier-2-domain-simulator

| System | Uses | Family | Departments | Data Kinds | Protocols |
| --- | ---: | --- | --- | --- | --- |
| HubSpot | 37 | crm-marketing | marketing | analytics_warehouse, collaboration_event, document_store, operational_system | REST API |
| Google BigQuery | 36 | platform-google-collaboration | hr | analytics_warehouse | unknown |
| Datadog | 18 | it-ops-security | it | analytics_warehouse, operational_system | REST API |
| GitHub | 15 | it-ops-security | it | collaboration_event, operational_system | GraphQL API, REST API, unknown |
| LMS | 15 | hr-talent | hr | operational_system | unknown |
| Google Analytics 4 | 14 | crm-marketing | marketing | analytics_warehouse | REST API |
| Jira | 12 | it-ops-security | hr, it, marketing | analytics_warehouse, collaboration_event, operational_system | REST API |
| Okta | 12 | it-ops-security | it | operational_system | REST API |
| Confluence | 11 | it-ops-security | hr, it | document_store | REST API, unknown |
| Google Sheets | 11 | platform-google-collaboration | hr, marketing | document_store, operational_system | Workspace API, unknown |
| Google Slides | 10 | platform-google-collaboration | finance, hr, it, procurement | collaboration_event, operational_system | Workspace API, unknown |
| Anaplan | 9 | finance-procurement | finance, hr, marketing | analytics_warehouse, collaboration_event, operational_system | REST API |
| Cornerstone | 9 | hr-talent | hr | analytics_warehouse, operational_system | REST API |
| Google Drive | 9 | platform-google-collaboration | hr, it, marketing | document_store | Workspace API |
| LinkedIn | 9 | crm-marketing | hr, marketing | analytics_warehouse, collaboration_event, document_store, external_feed, operational_system | REST API, unknown |
| SAP Ariba | 9 | finance-procurement | procurement | analytics_warehouse, operational_system | REST API |
| WordPress | 9 | crm-marketing | marketing | collaboration_event, document_store | REST API |
| ATS | 8 | hr-talent | hr | operational_system | unknown |
| BlackLine | 8 | finance-procurement | finance | operational_system | REST API |
| CrowdStrike | 8 | it-ops-security | it | document_store, operational_system | REST API |
| D&B | 8 | external-feeds | finance, procurement | analytics_warehouse, external_feed | REST API, unknown |
| GA4 | 8 | crm-marketing | marketing | operational_system | unknown |
| Gmail | 8 | platform-google-collaboration | hr | collaboration_event | unknown |
| Greenhouse | 8 | hr-talent | hr | analytics_warehouse, operational_system | REST API |
| Icertis | 8 | contract-lifecycle | procurement | document_store, operational_system | REST API |
| Kyriba | 8 | finance-procurement | finance | operational_system | REST API |
| SEMrush | 8 | crm-marketing | marketing | analytics_warehouse, document_store, external_feed | REST API |
| Sprout Social | 8 | crm-marketing | marketing | analytics_warehouse, collaboration_event | REST API |

## tier-3-adapter-template

| System | Uses | Family | Departments | Data Kinds | Protocols |
| --- | ---: | --- | --- | --- | --- |
| Google Calendar | 7 | platform-google-collaboration | hr, it, marketing, procurement | collaboration_event | Workspace API, unknown |
| Marketo | 7 | crm-marketing | marketing | analytics_warehouse, collaboration_event, operational_system | REST API |
| 6sense | 6 | long-tail-domain | marketing | analytics_warehouse, external_feed | REST API |
| DocuSign CLM | 6 | contract-lifecycle | procurement | document_store, operational_system | REST API |
| Dun & Bradstreet | 6 | external-feeds | procurement | analytics_warehouse, external_feed | REST API |
| Google Ads | 6 | crm-marketing | marketing | analytics_warehouse, operational_system | REST API |
| Google News API | 6 | external-feeds | marketing, procurement | external_feed | REST API |
| Lattice | 6 | hr-talent | hr | operational_system | REST API |
| SAP S/4HANA MM | 6 | finance-procurement | procurement | operational_system | REST API, RFC/BAPI |
| SAP SuccessFactors | 6 | hr-talent | hr | operational_system | OData API, REST API, unknown |
| ServiceNow GRC | 6 | it-ops-security | it | document_store, operational_system | REST API |
| Bloomberg | 5 | external-feeds | finance | external_feed | REST API |
| Chronicle SIEM | 5 | it-ops-security | it | analytics_warehouse | gRPC |
| Culture Amp | 5 | hr-talent | hr | operational_system | unknown |
| G2 | 5 | external-feeds | hr, marketing | analytics_warehouse, external_feed | REST API |
| Google Chat | 5 | long-tail-domain | hr | collaboration_event | unknown |
| Mercer | 5 | hr-talent | hr | external_feed | REST API |
| PagerDuty | 5 | it-ops-security | it | collaboration_event, operational_system | REST API |
| Qualtrics | 5 | long-tail-domain | hr, procurement | analytics_warehouse, operational_system | REST API |
| SAP BPC | 5 | finance-procurement | finance, hr | analytics_warehouse, operational_system | REST API, RFC/BAPI, unknown |
| Survey Platform | 5 | long-tail-domain | hr | operational_system | unknown |
| Ahrefs | 4 | crm-marketing | marketing | analytics_warehouse | REST API |
| Ariba SLP | 4 | finance-procurement | procurement | document_store, operational_system | REST API |
| AuditBoard | 4 | long-tail-domain | finance | operational_system | REST API |
| Canva | 4 | crm-marketing | marketing | collaboration_event | REST API |
| Contract Data | 4 | contract-lifecycle | procurement | analytics_warehouse, operational_system | REST API, unknown |
| Contract System | 4 | contract-lifecycle | procurement | operational_system | REST API |
| Gartner | 4 | external-feeds | hr, marketing, procurement | external_feed | REST API, unknown |
| Google Optimize | 4 | long-tail-domain | marketing | analytics_warehouse | REST API |
| HighRadius | 4 | finance-procurement | finance | operational_system | REST API |
| Legal DB | 4 | long-tail-domain | hr | operational_system | unknown |
| LinkedIn Ads | 4 | crm-marketing | marketing | analytics_warehouse, collaboration_event, operational_system | REST API |
| OneTrust | 4 | long-tail-domain | it, marketing | analytics_warehouse, operational_system | REST API |
| S&P Global Platts | 4 | external-feeds | procurement | analytics_warehouse, external_feed | REST API |
| SAP GRC | 4 | finance-procurement | finance, procurement | operational_system | REST API |
| ServiceNow CMDB | 4 | it-ops-security | it | operational_system | REST API |
| Amazon Business | 3 | long-tail-domain | procurement | operational_system | Punchout/cXML, REST API |
| Ariba | 3 | finance-procurement | procurement | operational_system | REST API, unknown |
| Basware | 3 | finance-procurement | finance, procurement | operational_system | REST API |
| Benefits Platform | 3 | long-tail-domain | hr | operational_system | unknown |
| Brandwatch | 3 | long-tail-domain | marketing | analytics_warehouse | REST API |
| Bynder | 3 | crm-marketing | marketing | collaboration_event | REST API |
| Chronicle | 3 | it-ops-security | it | operational_system | unknown |
| Contentful | 3 | long-tail-domain | marketing | document_store | REST API |
| dbt | 3 | long-tail-domain | it | analytics_warehouse, operational_system | CLI / REST API |
| Degreed | 3 | long-tail-domain | hr | document_store, operational_system | REST API |
| Email | 3 | long-tail-domain | hr, procurement | collaboration_event | SMTP, SMTP/Workspace API |
| Google Search Console | 3 | long-tail-domain | marketing | analytics_warehouse | REST API |
| Google Trends | 3 | long-tail-domain | marketing | external_feed | REST API |
| Hootsuite | 3 | long-tail-domain | marketing | analytics_warehouse, collaboration_event | REST API |
| Intranet | 3 | long-tail-domain | hr | operational_system | unknown |
| Jaggaer | 3 | long-tail-domain | procurement | operational_system | REST API |
| Kubernetes | 3 | it-ops-security | it | operational_system | Kubernetes API |
| ManageEngine | 3 | long-tail-domain | it | operational_system | REST API |
| Meta Ads Manager | 3 | long-tail-domain | marketing | analytics_warehouse | REST API |
| Moody's | 3 | external-feeds | finance, procurement | analytics_warehouse, external_feed, operational_system | REST API, unknown |
| Recognition Platform | 3 | long-tail-domain | hr | operational_system | unknown |
| Resilinc | 3 | external-feeds | procurement | external_feed | REST API |
| RSA Archer | 3 | long-tail-domain | it | analytics_warehouse, operational_system | REST API |
| Salesforce Marketing Cloud | 3 | crm-marketing | marketing | analytics_warehouse, operational_system | REST API |
| SAP S/4HANA CO | 3 | finance-procurement | finance | operational_system | OData, unknown |
| SAP S/4HANA SD | 3 | finance-procurement | finance | operational_system | OData, RFC/BAPI |
| ServiceNow SAM | 3 | it-ops-security | it | operational_system | REST API |
| SharePoint/Google Drive | 3 | platform-google-collaboration | finance, hr, procurement | document_store | Graph API / Drive API, REST API, Workspace API |
| SonarQube | 3 | it-ops-security | it | analytics_warehouse | REST API |
| Splunk | 3 | it-ops-security | it | analytics_warehouse | REST API |
| Supplier Portal | 3 | long-tail-domain | procurement | analytics_warehouse, collaboration_event | REST API |
| Taulia | 3 | finance-procurement | finance, procurement | operational_system | REST API |
| Terraform | 3 | it-ops-security | it | document_store, operational_system | CLI / REST API |
| Workiva | 3 | finance-procurement | finance | collaboration_event, document_store | REST API |
| Zoom | 3 | long-tail-domain | hr, it, marketing | collaboration_event, operational_system | REST API, unknown |

## tier-4-generic-feed-or-fixture

| System | Uses | Family | Departments | Data Kinds | Protocols |
| --- | ---: | --- | --- | --- | --- |
| Active Directory | 2 | long-tail-domain | hr | operational_system | LDAP/Graph API, unknown |
| ADP | 2 | long-tail-domain | hr | operational_system | REST API |
| Apigee | 2 | long-tail-domain | it | analytics_warehouse, operational_system | REST API |
| Ardoq | 2 | long-tail-domain | it | analytics_warehouse | REST API |
| Asana | 2 | long-tail-domain | marketing | collaboration_event | REST API |
| Assessment Platform | 2 | long-tail-domain | hr | operational_system | unknown |
| AWS Cost Explorer | 2 | long-tail-domain | it | operational_system | REST API |
| Bank Portals | 2 | long-tail-domain | finance | external_feed | SFTP, SFTP / SWIFT |
| Bloomberg Tax | 2 | external-feeds | finance | external_feed | REST API |
| Bonusly/Achievers | 2 | long-tail-domain | hr | operational_system | REST API |
| C2FO | 2 | finance-procurement | finance, procurement | operational_system | REST API |
| CCH AnswerConnect | 2 | long-tail-domain | finance | external_feed | REST API |
| Cision | 2 | long-tail-domain | marketing | external_feed | REST API |
| Contract Repository | 2 | contract-lifecycle | finance, procurement | operational_system | REST API |
| Coupa Catalog | 2 | finance-procurement | procurement | analytics_warehouse, operational_system | REST API |
| Coupa Pay | 2 | finance-procurement | procurement | operational_system | REST API |
| Demandbase | 2 | long-tail-domain | marketing | external_feed | REST API |
| E*Trade | 2 | long-tail-domain | hr | operational_system | unknown |
| Everstream | 2 | external-feeds | procurement | analytics_warehouse | REST API |
| Figma | 2 | crm-marketing | marketing | collaboration_event | REST API |
| GCP Billing | 2 | long-tail-domain | it | operational_system | REST API |
| Gong | 2 | long-tail-domain | marketing | analytics_warehouse | REST API |
| Highspot | 2 | long-tail-domain | marketing | analytics_warehouse, document_store | REST API |
| ICIS | 2 | long-tail-domain | procurement | external_feed | REST API |
| Indeed | 2 | long-tail-domain | hr | external_feed | REST API |
| Industry Benchmarks | 2 | long-tail-domain | procurement | external_feed | REST API |
| IRS TIN Matching | 2 | long-tail-domain | finance, procurement | external_feed | REST API |
| LeanIX | 2 | long-tail-domain | it | operational_system | REST API |
| LexisNexis | 2 | external-feeds | procurement | external_feed | REST API |
| Market Intel Feeds | 2 | long-tail-domain | procurement | external_feed | REST API |
| Meta Ads | 2 | long-tail-domain | marketing | analytics_warehouse, operational_system | REST API, unknown |
| Mintec | 2 | long-tail-domain | procurement | analytics_warehouse, external_feed | REST API |
| OFAC/SDN | 2 | external-feeds | procurement | external_feed | REST API |
| Oracle ERP | 2 | long-tail-domain | procurement | operational_system | REST API |
| Palo Alto | 2 | long-tail-domain | it | operational_system | REST API |
| Policy docs | 2 | long-tail-domain | procurement | document_store | unknown |
| Qualys | 2 | long-tail-domain | it | operational_system | REST API |
| Radford | 2 | long-tail-domain | hr | external_feed | REST API |
| RapidRatings | 2 | long-tail-domain | procurement | analytics_warehouse, external_feed | REST API |
| S&P Capital IQ | 2 | long-tail-domain | finance | external_feed | REST API |
| Salesforce | 2 | crm-marketing | finance, marketing | operational_system | REST API |
| SAP Ariba Contracts | 2 | finance-procurement | procurement | operational_system | REST API |
| SAP Concur | 2 | finance-procurement | procurement | document_store | REST API |
| SAP S/4HANA FI (F110) | 2 | finance-procurement | finance, procurement | operational_system | RFC/BAPI, unknown |
| SAP S/4HANA FI/CO | 2 | finance-procurement | finance | operational_system | RFC/BAPI |
| Scorecard Data | 2 | long-tail-domain | procurement | analytics_warehouse | REST API |
| SEC EDGAR | 2 | long-tail-domain | finance, procurement | external_feed | REST API |
| ServiceNow SPM | 2 | it-ops-security | it | operational_system | REST API |
| SharePoint | 2 | long-tail-domain | hr | document_store | unknown |
| Sievo | 2 | long-tail-domain | procurement | analytics_warehouse | REST API |
| Skills DB | 2 | long-tail-domain | hr | operational_system | unknown |
| Snyk | 2 | long-tail-domain | it | analytics_warehouse, operational_system | REST API |
| SpendHQ | 2 | long-tail-domain | procurement | analytics_warehouse | REST API |
| Tableau | 2 | long-tail-domain | hr | operational_system | unknown |
| ThomasNet | 2 | long-tail-domain | procurement | external_feed | REST API |
| World-Check | 2 | external-feeds | procurement | external_feed | REST API |
| YouTube | 2 | long-tail-domain | hr, marketing | analytics_warehouse, operational_system | REST API, unknown |
| Zylo | 2 | long-tail-domain | it | analytics_warehouse, operational_system | REST API |
| 360 Platform | 1 | long-tail-domain | hr | operational_system | unknown |
| AbsenceSoft | 1 | long-tail-domain | hr | operational_system | REST API |
| Agiloft | 1 | contract-lifecycle | procurement | operational_system | REST API |
| Apache Airflow | 1 | long-tail-domain | it | operational_system | REST API |
| Ardent Partners | 1 | long-tail-domain | procurement | external_feed | REST API |
| ArgoCD | 1 | long-tail-domain | it | operational_system | REST API |
| Ariba Catalog | 1 | finance-procurement | procurement | operational_system | cXML |
| Ariba/Coupa | 1 | finance-procurement | procurement | operational_system | REST API |
| Asana/Jira | 1 | it-ops-security | procurement | collaboration_event | REST API |
| ASN Data | 1 | long-tail-domain | procurement | operational_system | EDI/REST |
| Audit Tools | 1 | long-tail-domain | procurement | operational_system | unknown |
| Avalara | 1 | finance-procurement | finance | operational_system | REST API |
| AWS Backup | 1 | long-tail-domain | it | operational_system | REST API |
| AWS CloudFormation | 1 | long-tail-domain | it | operational_system | REST API |
| AWS CloudWatch | 1 | long-tail-domain | it | analytics_warehouse | REST API |
| AWS Route 53 | 1 | long-tail-domain | it | operational_system | REST API |
| AWS Security Hub | 1 | long-tail-domain | it | operational_system | REST API |
| Banking Systems | 1 | long-tail-domain | procurement | operational_system | REST API |
| Beeline | 1 | long-tail-domain | procurement | operational_system | REST API |
| Benchmark Databases | 1 | long-tail-domain | procurement | external_feed | REST API |
| Benefitfocus | 1 | long-tail-domain | hr | operational_system | REST API |
| Benefits Carrier Data | 1 | long-tail-domain | hr | operational_system | SFTP/REST API |

## platform-dependency

| System | Uses | Family | Departments | Data Kinds | Protocols |
| --- | ---: | --- | --- | --- | --- |
| Vertex AI (Gemini) | 341 | platform-google-collaboration | finance, hr, it, marketing, procurement | ai_or_model | gRPC |
| BigQuery | 272 | platform-google-collaboration | finance, hr, it, marketing, procurement | analytics_warehouse | BigQuery SQL |
| Vertex AI | 222 | platform-google-collaboration | finance, it, marketing, procurement | ai_or_model | gRPC, unknown |
| Google Document AI | 4 | platform-google-collaboration | finance, procurement | ai_or_model | REST API, gRPC |
| Google Cloud AI | 2 | long-tail-domain | hr | ai_or_model, operational_system | Vertex AI SDK, unknown |
| Vertex AI Feature Store | 1 | platform-google-collaboration | it | ai_or_model | gRPC |
| Vertex AI Model Registry | 1 | platform-google-collaboration | it | ai_or_model | gRPC |
| Vertex Tax | 1 | finance-procurement | finance | ai_or_model | REST API |

## First Simulator Candidates

| Candidate | Why | Simulator Focus |
| --- | --- | --- |
| Workday | 78 source references across finance, hr, it | hr-talent state, permissions, workflows, audit events |
| Looker | 51 source references across finance, hr, it, marketing, procurement | platform-google-collaboration state, permissions, workflows, audit events |
| Slack | 43 source references across finance, hr, it, marketing | platform-google-collaboration state, permissions, workflows, audit events |
| SAP S/4HANA FI | 32 source references across finance, procurement | finance-procurement state, permissions, workflows, audit events |
| Salesforce CRM | 31 source references across finance, marketing | crm-marketing state, permissions, workflows, audit events |
| ServiceNow | 31 source references across finance, hr, it, procurement | it-ops-security state, permissions, workflows, audit events |
| Google Docs | 30 source references across finance, hr, marketing, procurement | platform-google-collaboration state, permissions, workflows, audit events |
| SAP S/4HANA | 27 source references across finance, procurement | finance-procurement state, permissions, workflows, audit events |
| Coupa | 24 source references across finance, procurement | finance-procurement state, permissions, workflows, audit events |
| Google Workspace | 21 source references across hr, it, marketing | platform-google-collaboration state, permissions, workflows, audit events |

