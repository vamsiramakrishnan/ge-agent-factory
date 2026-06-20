// openapi-system-configs.mjs
//
// Curated per-system operation allowlists + generic-engine collection models for the
// six OpenAPI/Discovery import targets. Each config selects a high-value subset of
// operations (~15-25 tools/system, never all paths) and pins:
//   - the generic-engine collections (plural) + typed fields + state enums
//   - which spec operationId backs each read (search/get) and write (submit_*_update)
//   - role gates / transitions / approval blockers / failure-mode weights for writes
//   - a small, referentially-consistent seed (>=1 row per searchable/gettable collection;
//     write-target collections seeded in a state that can transition).
//
// The generator (generate-tools-from-openapi.mjs) turns these into the six contract files.

// Shared failure-mode weights drawn from the phase-1 typed errors.
const F = {
  permission_denied: 0.0,
  validation_error: 0.0,
  rate_limited: 0.0,
  conflict: 0.0,
};

// ---------------------------------------------------------------------------
// OKTA — Swagger 2.0 (identity / IGA)
// ---------------------------------------------------------------------------
const okta = {
  systemId: "okta",
  displayName: "Okta",
  specFile: "openapi.json",
  formatHint: "swagger2",
  stateField: "status",
  approvals: {
    seed: [
      { approval_id: "APPR-okta-1", source_record_id: "00u-USER-2", approver: "identity.admin@example.com", state: "requested", reason: "privileged group membership review" },
    ],
  },
  collections: [
    {
      name: "users",
      primaryKey: "user_id",
      description: "Okta user (identity) with lifecycle status and profile.",
      stateEnum: ["STAGED", "PROVISIONED", "ACTIVE", "SUSPENDED", "DEPROVISIONED"],
      fields: {
        user_id: "string",
        login: "string",
        email: "string",
        first_name: "string",
        last_name: "string",
        status: "enum:STAGED|PROVISIONED|ACTIVE|SUSPENDED|DEPROVISIONED",
        department: "string",
        manager: "string",
        last_login: "string",
      },
      reads: { search: "listUsers", get: "getUser" },
      write: {
        operationId: "updateUser",
        allowedRoles: ["identity_admin", "security_reviewer"],
        transitions: {
          "*": ["ACTIVE", "SUSPENDED", "DEPROVISIONED"],
          ACTIVE: ["SUSPENDED", "DEPROVISIONED"],
          SUSPENDED: ["ACTIVE", "DEPROVISIONED"],
          STAGED: ["PROVISIONED", "ACTIVE"],
          PROVISIONED: ["ACTIVE"],
        },
        approvalBlockers: [
          { collection: "approvals", sourceRecordField: "source_record_id", states: ["requested", "pending"], blockedTargetStates: ["DEPROVISIONED"] },
        ],
        failureModes: { permission_denied: 0.15, validation_error: 0.1, rate_limited: 0.05 },
      },
      seed: [
        { user_id: "00u-USER-1", login: "avery.johnson@example.com", email: "avery.johnson@example.com", first_name: "Avery", last_name: "Johnson", status: "ACTIVE", department: "HR", manager: "jordan.lee@example.com", last_login: "2026-06-15T08:12:00Z" },
        { user_id: "00u-USER-2", login: "mina.patel@example.com", email: "mina.patel@example.com", first_name: "Mina", last_name: "Patel", status: "ACTIVE", department: "Finance", manager: "jordan.lee@example.com", last_login: "2026-06-16T14:03:00Z" },
        { user_id: "00u-USER-3", login: "sam.rivera@example.com", email: "sam.rivera@example.com", first_name: "Sam", last_name: "Rivera", status: "SUSPENDED", department: "Engineering", manager: "avery.johnson@example.com", last_login: "2026-05-30T19:44:00Z" },
      ],
    },
    {
      name: "groups",
      primaryKey: "group_id",
      description: "Okta group used for access assignment and rules.",
      fields: {
        group_id: "string",
        name: "string",
        description: "string",
        group_type: "enum:OKTA_GROUP|APP_GROUP|BUILT_IN",
        member_count: "number",
        risk_tier: "enum:low|medium|high",
      },
      reads: { search: "listGroups", get: "getGroup" },
      seed: [
        { group_id: "00g-GRP-1", name: "HR Partners", description: "HR partner access", group_type: "OKTA_GROUP", member_count: 12, risk_tier: "medium" },
        { group_id: "00g-GRP-2", name: "Finance Admins", description: "Privileged finance access", group_type: "OKTA_GROUP", member_count: 4, risk_tier: "high" },
      ],
    },
    {
      name: "applications",
      primaryKey: "application_id",
      description: "Okta-integrated application (SSO/provisioning).",
      stateEnum: ["ACTIVE", "INACTIVE"],
      fields: {
        application_id: "string",
        name: "string",
        label: "string",
        sign_on_mode: "string",
        status: "enum:ACTIVE|INACTIVE",
        criticality: "enum:low|medium|high",
      },
      reads: { search: "listApplications", get: "getApplication" },
      seed: [
        { application_id: "0oa-APP-1", name: "workday", label: "Workday HCM", sign_on_mode: "SAML_2_0", status: "ACTIVE", criticality: "high" },
        { application_id: "0oa-APP-2", name: "github", label: "GitHub Enterprise", sign_on_mode: "OPENID_CONNECT", status: "ACTIVE", criticality: "medium" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// GITHUB — OpenAPI 3.x (dev platform). Operation ids are slash-namespaced
// (e.g. "issues/list-for-repo"); the generator matches them verbatim.
// ---------------------------------------------------------------------------
const github = {
  systemId: "github",
  displayName: "GitHub",
  specFile: "openapi.json",
  formatHint: "openapi3",
  stateField: "state",
  collections: [
    {
      name: "repositories",
      primaryKey: "repo_id",
      description: "GitHub repository.",
      fields: {
        repo_id: "string",
        owner: "string",
        repo: "string",
        full_name: "string",
        visibility: "enum:public|private|internal",
        default_branch: "string",
        open_issues: "number",
        archived: "boolean",
      },
      reads: { search: "repos/list-for-org", get: "repos/get" },
      seed: [
        { repo_id: "R-1", owner: "ge-aerospace", repo: "transformation-platform", full_name: "ge-aerospace/transformation-platform", visibility: "private", default_branch: "main", open_issues: 7, archived: false },
        { repo_id: "R-2", owner: "ge-aerospace", repo: "mcp-simulators", full_name: "ge-aerospace/mcp-simulators", visibility: "internal", default_branch: "main", open_issues: 3, archived: false },
      ],
    },
    {
      name: "issues",
      primaryKey: "issue_id",
      description: "GitHub issue with open/closed lifecycle.",
      stateEnum: ["open", "closed"],
      fields: {
        issue_id: "string",
        number: "number",
        owner: "string",
        repo: "string",
        title: "string",
        state: "enum:open|closed",
        state_reason: "enum:completed|not_planned|reopened",
        assignee: "string",
        labels: "array:string",
      },
      reads: { search: "issues/list-for-repo", get: "issues/get" },
      write: {
        operationId: "issues/update",
        allowedRoles: ["engineer", "project_manager", "maintainer"],
        transitions: { "*": ["open", "closed"], open: ["closed"], closed: ["open"] },
        failureModes: { permission_denied: 0.1, validation_error: 0.1, rate_limited: 0.1, conflict: 0.05 },
      },
      seed: [
        { issue_id: "I-101", number: 101, owner: "ge-aerospace", repo: "transformation-platform", title: "Flaky conformance test on CI", state: "open", state_reason: "reopened", assignee: "sam-rivera", labels: ["bug", "ci"] },
        { issue_id: "I-102", number: 102, owner: "ge-aerospace", repo: "transformation-platform", title: "Add durable state runbook", state: "open", state_reason: "reopened", assignee: "avery-johnson", labels: ["docs"] },
      ],
    },
    {
      name: "pulls",
      primaryKey: "pull_id",
      description: "GitHub pull request.",
      stateEnum: ["open", "closed"],
      fields: {
        pull_id: "string",
        number: "number",
        owner: "string",
        repo: "string",
        title: "string",
        state: "enum:open|closed",
        draft: "boolean",
        base: "string",
        head: "string",
        merged: "boolean",
      },
      reads: { search: "pulls/list", get: "pulls/get" },
      write: {
        operationId: "pulls/update",
        allowedRoles: ["engineer", "maintainer", "release_manager"],
        transitions: { "*": ["open", "closed"], open: ["closed"], closed: ["open"] },
        failureModes: { permission_denied: 0.1, conflict: 0.1, validation_error: 0.05 },
      },
      seed: [
        { pull_id: "PR-201", number: 201, owner: "ge-aerospace", repo: "transformation-platform", title: "feat: OpenAPI tools generator", state: "open", draft: false, base: "main", head: "openapi-import", merged: false },
        { pull_id: "PR-202", number: 202, owner: "ge-aerospace", repo: "mcp-simulators", title: "fix: seed drift", state: "open", draft: true, base: "main", head: "seed-fix", merged: false },
      ],
    },
    {
      name: "workflow_runs",
      primaryKey: "run_id",
      description: "GitHub Actions workflow run.",
      fields: {
        run_id: "string",
        owner: "string",
        repo: "string",
        name: "string",
        status: "enum:queued|in_progress|completed",
        conclusion: "enum:success|failure|cancelled|null",
        head_branch: "string",
      },
      reads: { search: "actions/list-workflow-runs-for-repo", get: "actions/get-workflow-run" },
      seed: [
        { run_id: "RUN-9001", owner: "ge-aerospace", repo: "transformation-platform", name: "CI", status: "completed", conclusion: "success", head_branch: "main" },
        { run_id: "RUN-9002", owner: "ge-aerospace", repo: "transformation-platform", name: "CI", status: "completed", conclusion: "failure", head_branch: "openapi-import" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// KUBERNETES — Swagger 2.0 (infra / orchestration). operationIds like
// "listCoreV1NamespacedPod", "readAppsV1NamespacedDeployment".
// ---------------------------------------------------------------------------
const kubernetes = {
  systemId: "kubernetes",
  displayName: "Kubernetes",
  specFile: "openapi.json",
  formatHint: "swagger2",
  stateField: "phase",
  collections: [
    {
      name: "pods",
      primaryKey: "pod_id",
      description: "Kubernetes Pod.",
      stateEnum: ["Pending", "Running", "Succeeded", "Failed", "Unknown"],
      fields: {
        pod_id: "string",
        name: "string",
        namespace: "string",
        node: "string",
        phase: "enum:Pending|Running|Succeeded|Failed|Unknown",
        restart_count: "number",
        image: "string",
      },
      reads: { search: "listCoreV1NamespacedPod", get: "readCoreV1NamespacedPod" },
      write: {
        operationId: "patchCoreV1NamespacedPod",
        allowedRoles: ["sre", "cluster_admin"],
        transitions: { "*": ["Pending", "Running", "Succeeded", "Failed"], Running: ["Succeeded", "Failed"], Pending: ["Running", "Failed"] },
        failureModes: { permission_denied: 0.1, conflict: 0.1, validation_error: 0.05 },
      },
      seed: [
        { pod_id: "pod-uid-1", name: "transformation-api-7d9", namespace: "default", node: "node-a", phase: "Running", restart_count: 0, image: "gcr.io/ge/transformation-api:1.4" },
        { pod_id: "pod-uid-2", name: "mcp-service-5f1", namespace: "platform", node: "node-b", phase: "Pending", restart_count: 2, image: "gcr.io/ge/mcp-service:2.0" },
      ],
    },
    {
      name: "deployments",
      primaryKey: "deployment_id",
      description: "Kubernetes Deployment (apps/v1).",
      stateEnum: ["Progressing", "Available", "ReplicaFailure"],
      fields: {
        deployment_id: "string",
        name: "string",
        namespace: "string",
        phase: "enum:Progressing|Available|ReplicaFailure",
        replicas: "number",
        ready_replicas: "number",
        image: "string",
      },
      reads: { search: "listAppsV1NamespacedDeployment", get: "readAppsV1NamespacedDeployment" },
      write: {
        operationId: "patchAppsV1NamespacedDeployment",
        allowedRoles: ["sre", "cluster_admin", "release_manager"],
        transitions: { "*": ["Progressing", "Available", "ReplicaFailure"], Progressing: ["Available", "ReplicaFailure"], Available: ["Progressing"] },
        failureModes: { permission_denied: 0.1, conflict: 0.1 },
      },
      seed: [
        { deployment_id: "dep-uid-1", name: "transformation-api", namespace: "default", phase: "Available", replicas: 3, ready_replicas: 3, image: "gcr.io/ge/transformation-api:1.4" },
        { deployment_id: "dep-uid-2", name: "mcp-service", namespace: "platform", phase: "Progressing", replicas: 2, ready_replicas: 1, image: "gcr.io/ge/mcp-service:2.0" },
      ],
    },
    {
      name: "services",
      primaryKey: "service_id",
      description: "Kubernetes Service.",
      fields: {
        service_id: "string",
        name: "string",
        namespace: "string",
        type: "enum:ClusterIP|NodePort|LoadBalancer|ExternalName",
        cluster_ip: "string",
        ports: "array:string",
      },
      reads: { search: "listCoreV1NamespacedService", get: "readCoreV1NamespacedService" },
      seed: [
        { service_id: "svc-uid-1", name: "transformation-api", namespace: "default", type: "ClusterIP", cluster_ip: "10.0.12.4", ports: ["8080/TCP"] },
        { service_id: "svc-uid-2", name: "mcp-service", namespace: "platform", type: "LoadBalancer", cluster_ip: "10.0.14.9", ports: ["443/TCP"] },
      ],
    },
    {
      name: "nodes",
      primaryKey: "node_id",
      description: "Kubernetes Node.",
      stateEnum: ["Ready", "NotReady", "SchedulingDisabled"],
      fields: {
        node_id: "string",
        name: "string",
        phase: "enum:Ready|NotReady|SchedulingDisabled",
        kubelet_version: "string",
        allocatable_cpu: "string",
        allocatable_memory: "string",
      },
      reads: { search: "listCoreV1Node", get: "readCoreV1Node" },
      seed: [
        { node_id: "node-uid-a", name: "node-a", phase: "Ready", kubelet_version: "v1.30.2", allocatable_cpu: "4", allocatable_memory: "16Gi" },
        { node_id: "node-uid-b", name: "node-b", phase: "Ready", kubelet_version: "v1.30.2", allocatable_cpu: "8", allocatable_memory: "32Gi" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// PAGERDUTY — OpenAPI 3.x (incident management)
// ---------------------------------------------------------------------------
const pagerduty = {
  systemId: "pagerduty",
  displayName: "PagerDuty",
  specFile: "openapi.json",
  formatHint: "openapi3",
  stateField: "status",
  collections: [
    {
      name: "incidents",
      primaryKey: "incident_id",
      description: "PagerDuty incident.",
      stateEnum: ["triggered", "acknowledged", "resolved"],
      fields: {
        incident_id: "string",
        incident_number: "number",
        title: "string",
        status: "enum:triggered|acknowledged|resolved",
        urgency: "enum:high|low",
        service_id: "ref:services.service_id",
        assignee: "string",
        created_at: "string",
      },
      reads: { search: "listIncidents", get: "getIncident" },
      write: {
        operationId: "updateIncident",
        allowedRoles: ["responder", "incident_commander", "manager"],
        transitions: { "*": ["triggered", "acknowledged", "resolved"], triggered: ["acknowledged", "resolved"], acknowledged: ["resolved", "triggered"] },
        failureModes: { permission_denied: 0.1, validation_error: 0.1, rate_limited: 0.05 },
      },
      seed: [
        { incident_id: "PINC-1", incident_number: 1, title: "transformation-api 5xx spike", status: "triggered", urgency: "high", service_id: "PSVC-1", assignee: "sam.rivera@example.com", created_at: "2026-06-17T06:01:00Z" },
        { incident_id: "PINC-2", incident_number: 2, title: "mcp-service latency", status: "acknowledged", urgency: "low", service_id: "PSVC-2", assignee: "avery.johnson@example.com", created_at: "2026-06-16T22:14:00Z" },
      ],
    },
    {
      name: "services",
      primaryKey: "service_id",
      description: "PagerDuty service (a monitored application).",
      stateEnum: ["active", "warning", "critical", "maintenance", "disabled"],
      fields: {
        service_id: "string",
        name: "string",
        status: "enum:active|warning|critical|maintenance|disabled",
        escalation_policy_id: "ref:escalation_policies.policy_id",
        description: "string",
      },
      reads: { search: "listServices", get: "getService" },
      seed: [
        { service_id: "PSVC-1", name: "transformation-api", status: "critical", escalation_policy_id: "PEP-1", description: "Customer-facing transformation API" },
        { service_id: "PSVC-2", name: "mcp-service", status: "warning", escalation_policy_id: "PEP-1", description: "Simulator MCP backend" },
      ],
    },
    {
      name: "escalation_policies",
      primaryKey: "policy_id",
      description: "PagerDuty escalation policy.",
      fields: {
        policy_id: "string",
        name: "string",
        num_loops: "number",
        description: "string",
      },
      reads: { search: "listEscalationPolicies", get: "getEscalationPolicy" },
      seed: [
        { policy_id: "PEP-1", name: "Platform On-Call", num_loops: 2, description: "Primary then secondary SRE" },
      ],
    },
    {
      name: "oncalls",
      primaryKey: "oncall_id",
      description: "PagerDuty on-call assignment (derived).",
      fields: {
        oncall_id: "string",
        policy_id: "ref:escalation_policies.policy_id",
        user: "string",
        escalation_level: "number",
        start: "string",
        end: "string",
      },
      reads: { search: "listOnCalls" },
      seed: [
        { oncall_id: "PONC-1", policy_id: "PEP-1", user: "sam.rivera@example.com", escalation_level: 1, start: "2026-06-17T00:00:00Z", end: "2026-06-24T00:00:00Z" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// BIGQUERY — Google Discovery (data warehouse). method ids like
// "bigquery.datasets.list", "bigquery.jobs.get".
// ---------------------------------------------------------------------------
const bigquery = {
  systemId: "bigquery",
  displayName: "BigQuery",
  specFile: "discovery.json",
  formatHint: "discovery",
  stateField: "state",
  collections: [
    {
      name: "datasets",
      primaryKey: "dataset_id",
      description: "BigQuery dataset.",
      fields: {
        dataset_id: "string",
        project_id: "string",
        location: "string",
        friendly_name: "string",
        default_table_expiration_ms: "string",
      },
      reads: { search: "bigquery.datasets.list", get: "bigquery.datasets.get" },
      seed: [
        { dataset_id: "ge_hr_analytics", project_id: "ge-transformation", location: "US", friendly_name: "HR Analytics", default_table_expiration_ms: "0" },
        { dataset_id: "ge_finance_close", project_id: "ge-transformation", location: "US", friendly_name: "Finance Close", default_table_expiration_ms: "0" },
      ],
    },
    {
      name: "tables",
      primaryKey: "table_id",
      description: "BigQuery table.",
      fields: {
        table_id: "string",
        dataset_id: "ref:datasets.dataset_id",
        project_id: "string",
        type: "enum:TABLE|VIEW|MATERIALIZED_VIEW|EXTERNAL",
        num_rows: "string",
        num_bytes: "string",
      },
      reads: { search: "bigquery.tables.list", get: "bigquery.tables.get" },
      seed: [
        { table_id: "headcount_snapshot", dataset_id: "ge_hr_analytics", project_id: "ge-transformation", type: "TABLE", num_rows: "48211", num_bytes: "10485760" },
        { table_id: "attrition_view", dataset_id: "ge_hr_analytics", project_id: "ge-transformation", type: "VIEW", num_rows: "0", num_bytes: "0" },
      ],
    },
    {
      name: "jobs",
      primaryKey: "job_id",
      description: "BigQuery job (query/load/extract).",
      stateEnum: ["PENDING", "RUNNING", "DONE"],
      fields: {
        job_id: "string",
        project_id: "string",
        state: "enum:PENDING|RUNNING|DONE",
        job_type: "enum:QUERY|LOAD|EXTRACT|COPY",
        user_email: "string",
        total_bytes_processed: "string",
      },
      reads: { search: "bigquery.jobs.list", get: "bigquery.jobs.get" },
      write: {
        operationId: "bigquery.jobs.cancel",
        allowedRoles: ["data_engineer", "data_admin"],
        transitions: { "*": ["PENDING", "RUNNING", "DONE"], RUNNING: ["DONE"], PENDING: ["RUNNING", "DONE"] },
        failureModes: { permission_denied: 0.1, validation_error: 0.05, rate_limited: 0.05 },
      },
      seed: [
        { job_id: "job_headcount_2026", project_id: "ge-transformation", state: "RUNNING", job_type: "QUERY", user_email: "mina.patel@example.com", total_bytes_processed: "10485760" },
        { job_id: "job_attrition_load", project_id: "ge-transformation", state: "PENDING", job_type: "LOAD", user_email: "avery.johnson@example.com", total_bytes_processed: "0" },
      ],
    },
    {
      name: "routines",
      primaryKey: "routine_id",
      description: "BigQuery routine (UDF / stored procedure).",
      fields: {
        routine_id: "string",
        dataset_id: "ref:datasets.dataset_id",
        project_id: "string",
        routine_type: "enum:SCALAR_FUNCTION|PROCEDURE|TABLE_VALUED_FUNCTION",
        language: "enum:SQL|JAVASCRIPT",
      },
      reads: { search: "bigquery.routines.list", get: "bigquery.routines.get" },
      seed: [
        { routine_id: "fn_normalize_title", dataset_id: "ge_hr_analytics", project_id: "ge-transformation", routine_type: "SCALAR_FUNCTION", language: "SQL" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// APIGEE — Google Discovery (API management). method ids like
// "apigee.organizations.apis.list", "apigee.organizations.developers.get".
// ---------------------------------------------------------------------------
const apigee = {
  systemId: "apigee",
  displayName: "Apigee",
  specFile: "discovery.json",
  formatHint: "discovery",
  stateField: "status",
  collections: [
    {
      name: "apis",
      primaryKey: "api_id",
      description: "Apigee API proxy.",
      fields: {
        api_id: "string",
        name: "string",
        org: "string",
        latest_revision_id: "string",
        revision_count: "number",
      },
      reads: { search: "apigee.organizations.apis.list", get: "apigee.organizations.apis.get" },
      seed: [
        { api_id: "transformation-gateway", name: "transformation-gateway", org: "ge-transformation", latest_revision_id: "7", revision_count: 7 },
        { api_id: "hr-events", name: "hr-events", org: "ge-transformation", latest_revision_id: "3", revision_count: 3 },
      ],
    },
    {
      name: "apiproducts",
      primaryKey: "apiproduct_id",
      description: "Apigee API product (bundle of proxies + quota).",
      fields: {
        apiproduct_id: "string",
        name: "string",
        display_name: "string",
        approval_type: "enum:auto|manual",
        environments: "array:string",
        quota: "string",
      },
      reads: { search: "apigee.organizations.apiproducts.list", get: "apigee.organizations.apiproducts.get" },
      seed: [
        { apiproduct_id: "platform-standard", name: "platform-standard", display_name: "Platform Standard", approval_type: "auto", environments: ["prod"], quota: "1000" },
        { apiproduct_id: "platform-internal", name: "platform-internal", display_name: "Platform Internal", approval_type: "manual", environments: ["test", "prod"], quota: "100000" },
      ],
    },
    {
      name: "developers",
      primaryKey: "developer_id",
      description: "Apigee developer (app owner).",
      stateEnum: ["active", "inactive"],
      fields: {
        developer_id: "string",
        email: "string",
        first_name: "string",
        last_name: "string",
        status: "enum:active|inactive",
        org: "string",
      },
      reads: { search: "apigee.organizations.developers.list", get: "apigee.organizations.developers.get" },
      write: {
        operationId: "apigee.organizations.developers.setDeveloperStatus",
        allowedRoles: ["api_admin", "org_admin"],
        transitions: { "*": ["active", "inactive"], active: ["inactive"], inactive: ["active"] },
        failureModes: { permission_denied: 0.1, validation_error: 0.05 },
      },
      seed: [
        { developer_id: "dev-1", email: "mina.patel@example.com", first_name: "Mina", last_name: "Patel", status: "active", org: "ge-transformation" },
        { developer_id: "dev-2", email: "sam.rivera@example.com", first_name: "Sam", last_name: "Rivera", status: "active", org: "ge-transformation" },
      ],
    },
    {
      name: "envgroups",
      primaryKey: "envgroup_id",
      description: "Apigee environment group (hostname routing for environments).",
      stateEnum: ["ACTIVE", "PROVISIONING"],
      fields: {
        envgroup_id: "string",
        name: "string",
        org: "string",
        status: "enum:ACTIVE|PROVISIONING",
        hostnames: "array:string",
      },
      reads: { search: "apigee.organizations.envgroups.list", get: "apigee.organizations.envgroups.get" },
      seed: [
        { envgroup_id: "prod-group", name: "prod-group", org: "ge-transformation", status: "ACTIVE", hostnames: ["api.ge-transformation.example.com"] },
        { envgroup_id: "test-group", name: "test-group", org: "ge-transformation", status: "ACTIVE", hostnames: ["test-api.ge-transformation.example.com"] },
      ],
    },
  ],
};

export const SYSTEM_CONFIGS = [okta, github, kubernetes, pagerduty, bigquery, apigee];
export default SYSTEM_CONFIGS;
