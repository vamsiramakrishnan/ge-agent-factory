import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Network, Activity, ShieldCheck, FileText, BarChart3 } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Continuous Monitor", lane: "system", type: "trigger" },
    { id: "a1", label: "Health Collection", lane: "agent", type: "action" },
    { id: "a2", label: "Anomaly Detection", lane: "agent", type: "action" },
    { id: "a3", label: "Correlation Report", lane: "agent", type: "output" },
    { id: "s2", label: "Network Dashboard", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"], ["a3", "s2"]],
};

const flow: FlowStep[] = [
  { label: "Health Collection", icon: Activity, description: "Network latency, DNS resolution, firewall rules, and certificate expiry monitored continuously.", trigger: "Continuous", systems: ["Datadog", "AWS Route 53"] },
  { label: "Anomaly Detection", icon: ShieldCheck, description: "Latency anomaly detection, traffic pattern analysis, certificate expiry prediction, rule conflict detection.", systems: ["BigQuery", "Vertex AI"], integration: "API" },
  { label: "Business Correlation", icon: FileText, description: "Gemini correlates network issues with business impact — shared resources, traffic interference patterns.", systems: ["Vertex AI"] },
  { label: "Network Dashboard", icon: BarChart3, description: "Network health dashboard with anomaly alerts and AI-generated impact analysis.", output: "Network Health Report" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Datadog", description: "Network latency metrics, DNS resolution times, traffic patterns", direction: "read", protocol: "REST API", category: "analytics" },
    { system: "AWS Route 53", description: "DNS health checks, record configurations, resolution data", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Palo Alto", description: "Firewall rule sets, traffic logs, security zone configurations", direction: "read", protocol: "REST API", category: "erp" },
    { system: "BigQuery", description: "Historical network data, anomaly models, traffic patterns", direction: "bidirectional", protocol: "BigQuery SQL", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Network issue correlation, business impact reasoning", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Health Data Collection", description: "Monitor network latency via Datadog, DNS resolution from Route 53, firewall rules from Palo Alto, and certificate expiry dates. Continuous ingestion with 1-minute granularity.", systems: ["Datadog", "AWS Route 53", "Palo Alto"], layer: "integration", dataIn: "Network metrics + DNS data + firewall configs", dataOut: "Unified network health dataset" },
    { label: "Anomaly & Risk Detection", description: "Latency anomaly detection using time-series models. Traffic pattern analysis for unusual volumes. Certificate expiry prediction. Firewall rule conflict detection across security zones.", systems: ["BigQuery"], layer: "ml", dataIn: "Network health dataset", dataOut: "Anomalies, expiring certs, rule conflicts" },
    { label: "Business Impact Correlation", description: "Gemini correlates: 'Intermittent 500ms latency spikes to payment gateway correlate with 2PM daily batch job on analytics cluster — they share the same NAT gateway. Recommend separate NAT for payment traffic.'", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Anomalies + traffic patterns + architecture data", dataOut: "Business-correlated network insights with remediation" },
    { label: "Dashboard & Alerting", description: "Network health dashboard with real-time metrics, anomaly alerts, certificate expiry countdown, and AI-generated impact analysis for infrastructure team.", systems: ["Datadog", "BigQuery"], layer: "integration", dataIn: "Network insights", dataOut: "Published dashboard with proactive alerts" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Cloud Architect / SRE Manager agent for the Network & DNS Health Monitor workflow",
  primaryObjective: "Gemini correlates network anomalies with business impact — identifying shared resource contention patterns. Certificate expiry prediction with 30-day alerts eliminates surprise outages from expired TLS certificates. so the Cloud Architect / SRE Manager can move the Latency anomaly detection KPI.",
  inScope: [
    "Gemini correlates network anomalies with business impact — identifying shared resource contention patterns",
    "Certificate expiry prediction with 30-day alerts eliminates surprise outages from expired TLS certificates",
    "Continuous firewall rule conflict detection prevents security gaps from overlapping or contradictory rules",
  ],
  outOfScope: [
    "Production deployments outside an approved change window",
    "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
    "Security incident attribution requiring forensics",
  ],
  toolIntents: [
    {
      name: "query_datadog_alerts",
      kind: "query",
      sourceSystemId: "datadog",
      description: "Retrieve alerts from Datadog for the Network & DNS Health Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "alerts_records",
        "alerts_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "query_aws_route_53_billing_records",
      kind: "query",
      sourceSystemId: "aws_route_53",
      description: "Retrieve billing records from AWS Route 53 for the Network & DNS Health Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "billing_records_records",
        "billing_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_palo_alto_palo_alto_records",
      kind: "query",
      sourceSystemId: "palo_alto",
      description: "Retrieve palo alto records from Palo Alto for the Network & DNS Health Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "palo_alto_records_records",
        "palo_alto_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_bigquery_analytics_events",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Retrieve analytics events from BigQuery for the Network & DNS Health Monitor workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "analytics_events_records",
        "analytics_events_summary",
      ],
      evidenceEmitted: [
        "sql_result",
      ],
    },
    {
      name: "lookup_network_dns_health_monitor_runbook",
      kind: "evidence_lookup",
      sourceSystemId: "datadog",
      description: "Look up sections of the Network & DNS Health Monitor Operations Runbook to cite in narrative output, escalation rationale, and audit evidence.",
      requiredInputs: [
        "section_anchor",
      ],
      produces: [
        "document_section",
        "citation_anchor",
      ],
      evidenceEmitted: [
        "document_reference",
      ],
    },
    {
      name: "action_aws_route_53_expire",
      kind: "action",
      sourceSystemId: "aws_route_53",
      description: "Execute the expire step in AWS Route 53 after the agent has gathered evidence and validated escalation gates.",
      requiredInputs: [
        "target_id",
        "rationale",
      ],
      produces: [
        "action_id",
        "audit_record_id",
      ],
      evidenceEmitted: [
        "api_response",
        "generated_audit_trail",
      ],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Latency anomaly detection moved from User reports toward <5 min automated",
      mustCite: [
        "datadog.alerts",
        "aws_route_53.billing_records",
      ],
      sourceSystemIds: [
        "datadog",
        "aws_route_53",
      ],
    },
    {
      claim: "Certificate expiry surprises moved from 2-3/year toward 0 (30-day alerts)",
      mustCite: [
        "datadog.alerts",
        "aws_route_53.billing_records",
      ],
      sourceSystemIds: [
        "datadog",
        "aws_route_53",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Latency anomaly detection regresses past the User reports baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Cloud Architect / SRE Manager",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed expire action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from Datadog (and other named systems) entities.",
    "Never bypass Cloud Architect / SRE Manager approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "network-dns-health-monitor-end-to-end",
      prompt: "Run the Network & DNS Health Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_datadog_alerts",
        "query_aws_route_53_billing_records",
        "query_palo_alto_palo_alto_records",
        "query_bigquery_analytics_events",
        "lookup_network_dns_health_monitor_runbook",
        "action_aws_route_53_expire",
      ],
      mustReferenceEntities: [
        "alerts",
        "billing_records",
        "palo_alto_records",
        "analytics_events",
      ],
      mustCiteDocuments: [
        "network-dns-health-monitor-runbook",
      ],
      expectedActionOutcome: "Action expire executed against AWS Route 53, with audit-trail entry and Cloud Architect / SRE Manager notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute expire without two-system evidence",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 50,
    minimumRowsPerEntity: 25,
    seed: 42,
    rationale: "Row counts sized for Network & DNS Health Monitor so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "datadog",
      name: "Datadog",
      owns: [
        "alerts",
        "monitors",
        "metrics_snapshots",
      ],
      protocol: "REST API",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_datadog_alerts",
        "query_datadog_monitors",
        "query_datadog_metrics_snapshots",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "aws_route_53",
      name: "AWS Route 53",
      owns: [
        "billing_records",
        "resource_inventory",
        "alarm_events",
      ],
      protocol: "AWS SDK",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_aws_route_53_billing_records",
        "query_aws_route_53_resource_inventory",
        "query_aws_route_53_alarm_events",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "palo_alto",
      name: "Palo Alto",
      owns: [
        "palo_alto_records",
        "palo_alto_events",
        "palo_alto_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_palo_alto_palo_alto_records",
        "query_palo_alto_palo_alto_events",
        "query_palo_alto_palo_alto_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: [
        "analytics_events",
        "historical_metrics",
        "cached_aggregates",
      ],
      protocol: "BigQuery SQL",
      localBacking: [
        "bigquery",
      ],
      toolNames: [
        "query_bigquery_analytics_events",
        "query_bigquery_historical_metrics",
        "query_bigquery_cached_aggregates",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "alerts",
      sourceSystemId: "datadog",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "title",
          type: "lorem.sentence",
          required: true,
        },
        {
          name: "priority",
          type: "enum",
          values: [
            "P1",
            "P2",
            "P3",
            "P4",
          ],
          weights: [
            0.05,
            0.15,
            0.4,
            0.4,
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "open",
            "triaged",
            "in_progress",
            "resolved",
            "closed",
          ],
          required: true,
        },
        {
          name: "assignee",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "category",
          type: "enum",
          values: [
            "access",
            "hardware",
            "software",
            "network",
            "policy",
            "billing",
          ],
          required: true,
        },
        {
          name: "sla_met",
          type: "boolean",
          trueRate: 0.78,
        },
      ],
    },
    {
      name: "monitors",
      sourceSystemId: "datadog",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "metrics_snapshots",
      sourceSystemId: "datadog",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "billing_records",
      sourceSystemId: "aws_route_53",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "service",
          type: "lorem.words",
          required: true,
        },
        {
          name: "amount",
          type: "float",
          min: 1,
          max: 10000,
          decimals: 2,
          required: true,
        },
        {
          name: "currency",
          type: "enum",
          values: [
            "USD",
            "EUR",
          ],
          required: true,
        },
        {
          name: "period_start",
          type: "date",
          required: true,
        },
        {
          name: "period_end",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "resource_inventory",
      sourceSystemId: "aws_route_53",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "alarm_events",
      sourceSystemId: "aws_route_53",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "billing_record_id",
          type: "ref",
          ref: "billing_records.id",
          required: true,
        },
      ],
    },
    {
      name: "palo_alto_records",
      sourceSystemId: "palo_alto",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "source_record_id",
          type: "seq",
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "pending",
            "closed",
          ],
          required: true,
        },
        {
          name: "owner",
          type: "person.fullName",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "palo_alto_events",
      sourceSystemId: "palo_alto",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
        {
          name: "palo_alto_record_id",
          type: "ref",
          ref: "palo_alto_records.id",
          required: true,
        },
      ],
    },
    {
      name: "palo_alto_audit_trail",
      sourceSystemId: "palo_alto",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "actor",
          type: "person.fullName",
          required: true,
        },
        {
          name: "action",
          type: "enum",
          values: [
            "create",
            "update",
            "delete",
            "approve",
            "reject",
            "escalate",
            "view",
            "share",
          ],
          required: true,
        },
        {
          name: "target_type",
          type: "lorem.words",
          required: true,
        },
        {
          name: "created_at",
          type: "date",
          required: true,
        },
        {
          name: "notes",
          type: "lorem.sentence",
        },
      ],
    },
    {
      name: "analytics_events",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
        {
          name: "historical_metric_id",
          type: "ref",
          ref: "historical_metrics.id",
          required: true,
        },
      ],
    },
    {
      name: "historical_metrics",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "cached_aggregates",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        {
          name: "id",
          type: "seq",
          required: true,
        },
        {
          name: "period",
          type: "enum",
          values: [
            "day",
            "week",
            "month",
            "quarter",
          ],
          required: true,
        },
        {
          name: "metric_name",
          type: "lorem.words",
          required: true,
        },
        {
          name: "value",
          type: "float",
          min: 0,
          max: 100000,
          decimals: 2,
          required: true,
        },
        {
          name: "variance_pct",
          type: "float",
          min: -50,
          max: 50,
          decimals: 2,
          required: true,
        },
        {
          name: "computed_at",
          type: "date",
          required: true,
        },
      ],
    },
  ],
  relationships: [
    {
      from: "alarm_events.billing_record_id",
      to: "billing_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "palo_alto_events.palo_alto_record_id",
      to: "palo_alto_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "analytics_events.historical_metric_id",
      to: "historical_metrics.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "network-dns-health-monitor-runbook",
      sourceSystemId: "datadog",
      type: "runbook",
      title: "Network & DNS Health Monitor Operations Runbook",
      requiredSections: [
        "Detection signals",
        "Triage procedures",
        "Remediation actions",
        "Rollback criteria",
        "Post-incident review",
      ],
      linkedEntities: [
        "alerts",
        "monitors",
        "metrics_snapshots",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "detection",
        "triage",
        "remediation",
        "rollback",
      ],
    },
  ],
  apis: [
    {
      id: "aws_route_53_expire_api",
      sourceSystemId: "aws_route_53",
      method: "POST",
      path: "/api/aws_route_53/expire",
      description: "Synchronous endpoint the agent calls to expire in AWS Route 53 after evidence gating.",
      requestSchema: {
        target_id: "string",
        rationale: "string",
        metadata: "object",
      },
      responseSchema: {
        action_id: "string",
        status: "string",
        audit_record_id: "string",
      },
      idempotencyKey: "target_id+rationale",
    },
  ],
  anomalies: [
    {
      id: "network-dns-health-monitor-baseline-gap",
      description: "Seed a realistic gap where Latency anomaly detection sits between User reports and <5 min automated, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "alerts",
        "monitors",
      ],
      discoveryPath: [
        "Inspect Datadog records for the affected entities",
        "Compare against AWS Route 53 historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Cloud Architect / SRE Manager action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "network_dns_health_monitor",
      schemas: [
        "aws_route_53",
        "palo_alto",
      ],
    },
    bigquery: {
      dataset: "it_network_dns_health_monitor",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "network-dns-health-monitor-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "network-dns-health-monitor-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Network & DNS Health Monitor workflow and cite source-system evidence for every claim.",
    expectedAnswer: [
      "uses canonical source-system tools",
      "cites the governing document",
      "names the next operator action",
    ],
    assertions: [
      "canonical source-system tool names",
      "minimum row policy met",
      "audit trail emitted on actions",
      "evidence_lookup invoked before recommendations",
    ],
  },
  behaviorContract: behaviorContract,
};

export const NetworkDNSHealthMonitor = () => (
  <UseCaseSlide
    title="Network & DNS Health Monitor"
    subtitle="A-4007 • Infra & Cloud Ops"
    icon={Network}
    domainId="domain-40"
    layer="Layer 2: Agent Designer"
    persona="Cloud Architect / SRE Manager"
    systems={["Datadog", "AWS Route 53", "Palo Alto", "BigQuery", "Vertex AI"]}
    kpis={[
      { label: "Latency anomaly detection", before: "User reports", after: "<5 min automated" },
      { label: "Certificate expiry surprises", before: "2-3/year", after: "0 (30-day alerts)" },
      { label: "Network-related outages", before: "Reactive investigation", after: "Proactive prevention" },
    ]}
    triggerType="scheduled"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    statusQuo={[
      "Network latency issues discovered when users report slowness — no proactive anomaly detection.",
      "Certificate expirations cause outages 2-3 times per year because manual tracking fails.",
      "Firewall rule conflicts discovered during incident investigation, not proactively audited."
    ]}
    agentification={[
      "Gemini correlates network anomalies with business impact — identifying shared resource contention patterns.",
      "Certificate expiry prediction with 30-day alerts eliminates surprise outages from expired TLS certificates.",
      "Continuous firewall rule conflict detection prevents security gaps from overlapping or contradictory rules."
    ]}
  />
);
