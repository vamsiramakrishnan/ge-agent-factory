# OpenAPI Realism Analysis

Generated: 2026-06-19T22:47:31.351Z

## Summary

- Systems scanned: 54
- Machine-readable specs: 9
- Specs needing parser support: none
- Docs/source-metadata only: 45
- Parsed operations: 5486
- Pagination signals: apigee, bigquery, datadog, docusign_clm, github, jira, okta, pagerduty
- Async/job signals: apigee, bigquery, datadog, docusign_clm, github, jira, kubernetes, okta, pagerduty
- Webhook/event signals: apigee, datadog, github, jira, kubernetes, okta, pagerduty
- Rate-limit signals: datadog, docusign_clm, github, jira, pagerduty

## High-Value Spec Signals

### Apigee (apigee)

- Spec: `simulator-systems/_openapi/apigee/discovery.json` (discovery, 373 operations)
- Current pack: domain_realistic, 11 tools, 1 handlers, 26 non-audit seed rows
- Security: oauth2:oauth2
- Pagination params: pageSize, pageToken, offset, limit
- Filter/query params: filter, expand, to, from, status, ids, query, sort, sortby, type, state, orderBy
- Error codes: none detected
- Async/job sample: DELETE v1/organizations/{organizationsId}; GET v1/organizations/{organizationsId}/operations/{operationsId}; GET v1/organizations/{organizationsId}/operations; GET v1/organizations/{organizationsId}/hostSecurityReports
- Webhook/event sample: DELETE v1/organizations/{organizationsId}; POST v1/organizations/{organizationsId}/appgroups/{appgroupsId}/subscriptions/{subscriptionsId}:expire; GET v1/organizations/{organizationsId}/appgroups/{appgroupsId}/subscriptions/{subscriptionsId}; GET v1/organizations/{organizationsId}/appgroups/{appgroupsId}/subscriptions
- Recommendations:

### BigQuery (bigquery)

- Spec: `simulator-systems/_openapi/bigquery/discovery.json` (discovery, 47 operations)
- Current pack: domain_realistic, 11 tools, 1 handlers, 25 non-audit seed rows
- Security: oauth2:oauth2
- Pagination params: maxResults, pageToken, pageSize
- Filter/query params: filter
- Error codes: none detected
- Async/job sample: DELETE projects/{projectsId}/jobs/{jobsId}/delete; GET projects/{projectsId}/queries/{queriesId}; POST projects/{projectsId}/jobs; GET projects/{projectsId}/jobs
- Recommendations:

### Datadog (datadog)

- Spec: `simulator-systems/_openapi/datadog/openapi.yaml` (openapi3, 1366 operations)
- Current pack: domain_realistic, 15 tools, 4 handlers, 29 non-audit seed rows
- Security: AuthZ:oauth2, apiKeyAuth:apiKey, appKeyAuth:apiKey, bearerAuth:http
- Pagination params: page_size, limit, page, offset, cursor, page_token, per_page
- Filter/query params: filter, id, sort, include, query, to, order_by, order, fields, search, status, filters, from
- Error codes: 400, 401, 403, 404, 429, 422, 500, 409, 410, 408, 413, 503, 412, 504, 415
- Async/job sample: POST /api/v2/actions-datastores/{datastore_id}/items/bulk; DELETE /api/v2/actions-datastores/{datastore_id}/items/bulk; GET /api/v2/agentless_scanning/ondemand/aws; POST /api/v2/agentless_scanning/ondemand/aws
- Webhook/event sample: GET /api/v2/agentless_scanning/accounts/azure/{subscription_id}; PATCH /api/v2/agentless_scanning/accounts/azure/{subscription_id}; DELETE /api/v2/agentless_scanning/accounts/azure/{subscription_id}; GET /api/v2/audit/events
- Recommendations:

### DocuSign CLM (docusign_clm)

- Spec: `simulator-systems/_openapi/docusign_clm/openapi.json` (openapi3, 10 operations)
- Current pack: domain_realistic, 17 tools, 4 handlers, 47 non-audit seed rows
- Security: accessToken:oauth2
- Pagination params: limit
- Filter/query params: sort, id, status
- Error codes: 400, 401, 403, 404, 500, 422, 429
- Async/job sample: GET /v1/accounts/{accountId}/agreements; POST /v1/accounts/{accountId}/upload/jobs; GET /v1/accounts/{accountId}/upload/jobs/{jobId}; POST /v1/accounts/{accountId}/upload/jobs/{jobId}/actions/complete
- Recommendations:

### GitHub (github)

- Spec: `simulator-systems/_openapi/github/openapi.json` (openapi3, 1190 operations)
- Current pack: domain_realistic, 12 tools, 2 handlers, 27 non-audit seed rows
- Security: none detected
- Pagination params: before, after, per_page, page, cursor
- Filter/query params: type, sort, state, since, status, filter, until, exclude, q, fields, order
- Error codes: 422, 429, 404, 400, 401, 403, 500, 409, 503, 413, 410, 406, 405, 402
- Async/job sample: GET /agents/repos/{owner}/{repo}/tasks; POST /agents/repos/{owner}/{repo}/tasks; GET /agents/repos/{owner}/{repo}/tasks/{task_id}; GET /agents/tasks
- Webhook/event sample: GET /app/hook/config; PATCH /app/hook/config; GET /app/hook/deliveries; GET /app/hook/deliveries/{delivery_id}
- Recommendations:

### Jira (jira)

- Spec: `simulator-systems/_openapi/jira/openapi.json` (openapi3, 619 operations)
- Current pack: domain_realistic, 22 tools, 4 handlers, 41 non-audit seed rows
- Security: OAuth2:oauth2, basicAuth:http
- Pagination params: startAt, maxResults, offset, limit, cursor, nextPageToken, after
- Filter/query params: id, filter, from, to, type, status, orderBy, expand, query, ids, exclude, fields, since
- Error codes: 401, 403, 400, 404, 416, 409, 500, 429, 422, 412, 413, 405, 423, 503, 408, 501
- Async/job sample: POST /rest/api/3/app/field/context/configuration/list; GET /rest/api/3/applicationrole/{key}; POST /rest/api/3/bulk/issues/delete; GET /rest/api/3/bulk/issues/fields
- Webhook/event sample: POST /rest/api/3/app/field/value; PUT /rest/api/3/app/field/{fieldIdOrKey}/value; POST /rest/api/3/bulk/issues/watch; GET /rest/api/3/events
- Recommendations:

### Kubernetes (kubernetes)

- Spec: `simulator-systems/_openapi/kubernetes/openapi.json` (swagger2, 1111 operations)
- Current pack: domain_realistic, 12 tools, 2 handlers, 26 non-audit seed rows
- Security: BearerToken:apiKey
- Pagination params: none detected
- Filter/query params: none detected
- Error codes: 401
- Async/job sample: POST /api/v1/namespaces; POST /api/v1/namespaces/{namespace}/bindings; POST /api/v1/namespaces/{namespace}/configmaps; DELETE /api/v1/namespaces/{namespace}/configmaps
- Webhook/event sample: GET /api/v1/configmaps; GET /api/v1/endpoints; GET /api/v1/events; GET /api/v1/limitranges
- Recommendations:

### Okta (okta)

- Spec: `simulator-systems/_openapi/okta/openapi.json` (swagger2, 341 operations)
- Current pack: domain_realistic, 10 tools, 1 handlers, 26 non-audit seed rows
- Security: api_token:apiKey
- Pagination params: after, limit, cursor
- Filter/query params: q, filter, expand, search, type, since, until, status, sortBy
- Error codes: 404, 400, 409
- Async/job sample: GET /api/v1/apps; POST /api/v1/apps; GET /api/v1/idps/{idpId}/users/{userId}/credentials/tokens; DELETE /api/v1/inlineHooks/{inlineHookId}
- Webhook/event sample: GET /api/v1/inlineHooks/{inlineHookId}; PUT /api/v1/inlineHooks/{inlineHookId}; DELETE /api/v1/inlineHooks/{inlineHookId}; POST /api/v1/inlineHooks/{inlineHookId}/execute
- Recommendations:

### PagerDuty (pagerduty)

- Spec: `simulator-systems/_openapi/pagerduty/openapi.json` (openapi3, 429 operations)
- Current pack: domain_realistic, 10 tools, 1 handlers, 26 non-audit seed rows
- Security: api_key:apiKey
- Pagination params: limit, offset, after, before, cursor
- Filter/query params: id, filter, since, until, query, sort_by, From, type, ids, status
- Error codes: 400, 401, 403, 429, 402, 404, 500, 422, 405, 409, 413
- Async/job sample: GET /business_services/{id}/supporting_services/impacts; GET /business_services/impacts; GET /event_orchestrations/services/{service_id}/active; PUT /event_orchestrations/services/{service_id}/active
- Webhook/event sample: POST /business_services/{id}/account_subscription; DELETE /business_services/{id}/account_subscription; GET /change_events; POST /change_events
- Recommendations:

## Docs-Only Systems

These systems have cached docs/source metadata but no machine-readable spec. They need either a public spec, an internal captured spec, or a manually curated API profile before automated OpenAPI learning can help.

`absencesoft`, `anaplan`, `auditboard`, `avalara`, `basware`, `benefitfocus`, `blackline`, `c2fo`, `capa_tools`, `capa_tracking`, `cornerstone`, `coupa`, `crowdstrike`, `dbt`, `google_ads`, `greenhouse`, `highradius`, `hubspot`, `icertis`, `innovation_management`, `insurance_cert_management`, `jaggaer`, `kyriba`, `lattice`, `leandata`, `leanix`, `longview_onesource`, `manageengine`, `marketo`, `meta_ads_manager`, `onetrust`, `qualtrics`, `salesforce_crm`, `salesforce_marketing_cloud`, `sap_ariba`, `sap_concur`, `sap_fieldglass`, `sap_s4hana_fi`, `sap_s4hana_mm`, `servicenow`, `taulia`, `terraform`, `workday`, `workiva`, `zendesk`
