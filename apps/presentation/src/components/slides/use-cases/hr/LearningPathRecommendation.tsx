import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { AgentArchitecture, UseCaseGenerationSpec, AgentBehaviorContract} from "../../../../types/architecture";
import { Compass, User, Search, GitBranch, TrendingUp } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "h1", label: "Learner Request", lane: "human", type: "trigger" },
    { id: "a1", label: "Path Curation", lane: "agent", type: "action" },
    { id: "a2", label: "Adaptive Sequencing", lane: "agent", type: "action" },
    { id: "a3", label: "Learning Path", lane: "agent", type: "output" },
  ],
  connections: [["h1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Learner Profile", icon: User, description: "Role, skills, goals, learning history analyzed.", trigger: "On-demand", systems: ["HRIS", "LMS"] },
  { label: "Path Curation", icon: Search, description: "Content matched from internal and external catalogs.", systems: ["Gemini", "LMS"], integration: "Agent Designer" },
  { label: "Adaptive Sequencing", icon: GitBranch, description: "Learning path adapts based on progress and preferences." },
  { label: "Progress Tracked", icon: TrendingUp, description: "Skill acquisition measured with manager visibility.", output: "Learning Path" }
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Cornerstone", description: "Internal learning catalog, completion history, competency frameworks", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Degreed", description: "External content library, skill ratings, learning activity signals", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Workday", description: "Role profile, career aspirations, skills inventory, successor readiness", direction: "read", protocol: "REST API", category: "erp" },
    { system: "Vertex AI (Gemini)", description: "Path curation reasoning, adaptive sequencing, career-aligned recommendations", direction: "bidirectional", protocol: "gRPC", category: "ai" },
  ],
  pipeline: [
    { label: "Learner Profile Analysis", description: "Assemble learner profile from Workday (role, skills, career goals) and learning history from Cornerstone and Degreed. Identify skill gaps relative to target role.", systems: ["Workday", "Cornerstone", "Degreed"], layer: "integration", dataIn: "Employee ID + career aspirations", dataOut: "Complete learner profile with skill gaps" },
    { label: "Path Curation", description: "Gemini matches learner gaps against internal LMS and external content catalogs. Ranks content by relevance, quality ratings, and format preferences.", systems: ["Vertex AI (Gemini)", "Cornerstone", "Degreed"], layer: "llm", dataIn: "Learner profile + available content catalog", dataOut: "Curated content recommendations ranked by fit" },
    { label: "Adaptive Sequencing", description: "Build personalized learning path with adaptive sequencing based on prerequisite dependencies, learning style, and progress. Adjust path dynamically as learner advances.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Curated content + learner progress data", dataOut: "Dynamic learning path with milestone checkpoints" },
    { label: "Progress Tracking", description: "Track skill acquisition against learning path milestones. Surface progress to learner and manager with career-aligned nudges based on successor readiness.", systems: ["Cornerstone", "Workday"], layer: "integration", dataIn: "Learning completions + assessment scores", dataOut: "Progress dashboard with skill acquisition metrics" },
  ],
};


const behaviorContract: AgentBehaviorContract = {
  role: "Employee agent for the Learning Path Recommendation workflow",
  primaryObjective: "Personalized paths recommended based on role, skills, and goals. Dynamic integration of internal LMS and external content libraries. so the Employee can move the Path relevance KPI.",
  inScope: [
    "Personalized paths recommended based on role, skills, and goals",
    "Dynamic integration of internal LMS and external content libraries",
    "Career-aligned learning nudges based on successor readiness",
  ],
  outOfScope: [
    "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
    "Performance management adjudication and disciplinary action",
    "Legal interpretation of employment law in ambiguous jurisdictions",
  ],
  toolIntents: [
    {
      name: "query_lms_lms_records",
      kind: "query",
      sourceSystemId: "lms",
      description: "Retrieve lms records from LMS for the Learning Path Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "lms_records_records",
        "lms_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_workday_employees",
      kind: "query",
      sourceSystemId: "workday",
      description: "Retrieve employees from Workday for the Learning Path Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "employees_records",
        "employees_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_udemy_udemy_records",
      kind: "query",
      sourceSystemId: "udemy",
      description: "Retrieve udemy records from Udemy for the Learning Path Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "udemy_records_records",
        "udemy_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "query_coursera_coursera_records",
      kind: "query",
      sourceSystemId: "coursera",
      description: "Retrieve coursera records from Coursera for the Learning Path Recommendation workflow.",
      requiredInputs: [
        "lookup_key",
        "date_range",
      ],
      produces: [
        "coursera_records_records",
        "coursera_records_summary",
      ],
      evidenceEmitted: [
        "source_system_record",
      ],
    },
    {
      name: "lookup_learning_path_recommendation_policy_handbook",
      kind: "evidence_lookup",
      sourceSystemId: "lms",
      description: "Look up sections of the Learning Path Recommendation Policy Handbook to cite in narrative output, escalation rationale, and audit evidence.",
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
      name: "action_lms_recommend",
      kind: "action",
      sourceSystemId: "lms",
      description: "Execute the recommend step in LMS after the agent has gathered evidence and validated escalation gates.",
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
      claim: "Path relevance moved from Generic catalog toward Personalized",
      mustCite: [
        "lms.lms_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "lms",
        "workday",
      ],
    },
    {
      claim: "Completion rates moved from 25% toward 68%",
      mustCite: [
        "lms.lms_records",
        "workday.employees",
      ],
      sourceSystemIds: [
        "lms",
        "workday",
      ],
    },
  ],
  escalationRules: [
    {
      trigger: "Path relevance regresses past the Generic catalog baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: "Employee",
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
    {
      trigger: "Proposed recommend action lacks supporting evidence from at least two systems",
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    },
  ],
  refusalRules: [
    "Never fabricate metric values; only publish numbers derived from LMS (and other named systems) entities.",
    "Never bypass Employee approval on escalation triggers, even when confidence is high.",
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ],
  goldenEvals: [
    {
      id: "learning-path-recommendation-end-to-end",
      prompt: "Run the Learning Path Recommendation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.",
      expectedToolCalls: [
        "query_lms_lms_records",
        "query_workday_employees",
        "query_udemy_udemy_records",
        "query_coursera_coursera_records",
        "lookup_learning_path_recommendation_policy_handbook",
        "action_lms_recommend",
      ],
      mustReferenceEntities: [
        "lms_records",
        "employees",
        "udemy_records",
        "coursera_records",
      ],
      mustCiteDocuments: [
        "learning-path-recommendation-policy-handbook",
      ],
      expectedActionOutcome: "Action recommend executed against LMS, with audit-trail entry and Employee notified of outcomes.",
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        "do not execute recommend without two-system evidence",
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
    rationale: "Row counts sized for Learning Path Recommendation so the agent can demonstrate the workflow against realistic transactional volume without simulating a production warehouse.",
  },
  sourceSystems: [
    {
      id: "lms",
      name: "LMS",
      owns: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_lms_lms_records",
        "query_lms_lms_events",
        "query_lms_lms_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "workday",
      name: "Workday",
      owns: [
        "employees",
        "positions",
        "compensation_records",
      ],
      protocol: "Workday REST",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_workday_employees",
        "query_workday_positions",
        "query_workday_compensation_records",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "udemy",
      name: "Udemy",
      owns: [
        "udemy_records",
        "udemy_events",
        "udemy_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_udemy_udemy_records",
        "query_udemy_udemy_events",
        "query_udemy_udemy_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
    {
      id: "coursera",
      name: "Coursera",
      owns: [
        "coursera_records",
        "coursera_events",
        "coursera_audit_trail",
      ],
      protocol: "REST API",
      localBacking: [
        "alloydb",
      ],
      toolNames: [
        "query_coursera_coursera_records",
        "query_coursera_coursera_events",
        "query_coursera_coursera_audit_trail",
      ],
      evidence: [
        "source_system_record",
        "generated_audit_trail",
      ],
    },
  ],
  entities: [
    {
      name: "lms_records",
      sourceSystemId: "lms",
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
      name: "lms_events",
      sourceSystemId: "lms",
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
          name: "lms_record_id",
          type: "ref",
          ref: "lms_records.id",
          required: true,
        },
      ],
    },
    {
      name: "lms_audit_trail",
      sourceSystemId: "lms",
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
      name: "employees",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "positions",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "compensation_records",
      sourceSystemId: "workday",
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
          name: "name",
          type: "person.fullName",
          required: true,
        },
        {
          name: "email",
          type: "internet.email",
          required: true,
        },
        {
          name: "department",
          type: "enum",
          values: [
            "Finance",
            "HR",
            "IT",
            "Marketing",
            "Procurement",
            "Engineering",
            "Operations",
          ],
          required: true,
        },
        {
          name: "region",
          type: "enum",
          values: [
            "US",
            "EMEA",
            "APAC",
            "LATAM",
          ],
          required: true,
        },
        {
          name: "status",
          type: "enum",
          values: [
            "active",
            "on_leave",
            "inactive",
          ],
          weights: [
            0.85,
            0.1,
            0.05,
          ],
          required: true,
        },
        {
          name: "level",
          type: "enum",
          values: [
            "L3",
            "L4",
            "L5",
            "L6",
            "L7",
          ],
          required: true,
        },
        {
          name: "hired_on",
          type: "date",
          required: true,
        },
      ],
    },
    {
      name: "udemy_records",
      sourceSystemId: "udemy",
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
      name: "udemy_events",
      sourceSystemId: "udemy",
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
          name: "udemy_record_id",
          type: "ref",
          ref: "udemy_records.id",
          required: true,
        },
      ],
    },
    {
      name: "udemy_audit_trail",
      sourceSystemId: "udemy",
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
      name: "coursera_records",
      sourceSystemId: "coursera",
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
      name: "coursera_events",
      sourceSystemId: "coursera",
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
          name: "coursera_record_id",
          type: "ref",
          ref: "coursera_records.id",
          required: true,
        },
      ],
    },
    {
      name: "coursera_audit_trail",
      sourceSystemId: "coursera",
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
  ],
  relationships: [
    {
      from: "lms_events.lms_record_id",
      to: "lms_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "udemy_events.udemy_record_id",
      to: "udemy_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
    {
      from: "coursera_events.coursera_record_id",
      to: "coursera_records.id",
      cardinality: "many-to-one",
      orphanPolicy: "none",
    },
  ],
  documents: [
    {
      id: "learning-path-recommendation-policy-handbook",
      sourceSystemId: "lms",
      type: "policy",
      title: "Learning Path Recommendation Policy Handbook",
      requiredSections: [
        "Eligibility and scope",
        "Workflow steps",
        "Manager responsibilities",
        "Compliance and audit",
        "Sensitive-data handling",
      ],
      linkedEntities: [
        "lms_records",
        "lms_events",
        "lms_audit_trail",
      ],
      minimumWordCount: 500,
      citationAnchors: [
        "eligibility",
        "workflow",
        "compliance",
        "sensitive-data",
      ],
    },
  ],
  apis: [
    {
      id: "lms_recommend_api",
      sourceSystemId: "lms",
      method: "POST",
      path: "/api/lms/recommend",
      description: "Synchronous endpoint the agent calls to recommend in LMS after evidence gating.",
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
      id: "learning-path-recommendation-baseline-gap",
      description: "Seed a realistic gap where Path relevance sits between Generic catalog and Personalized, so the agent can detect, narrate, and recommend remediation.",
      affectedEntities: [
        "lms_records",
        "lms_events",
      ],
      discoveryPath: [
        "Inspect LMS records for the affected entities",
        "Compare against Workday historical baseline",
        "Generate a citation-backed recommendation",
      ],
      expectedEvidence: [
        "source-system record",
        "historical baseline metric",
        "generated audit trail",
      ],
      expectedRecommendation: "Explain the gap, cite supporting evidence, and propose the next Employee action.",
    },
  ],
  datastorePackaging: {
    alloydb: {
      database: "learning_path_recommendation",
      schemas: [
        "lms",
        "workday",
        "udemy",
        "coursera",
      ],
    },
    bigquery: {
      dataset: "hr_learning_path_recommendation",
      tables: [
        "kpi_summary",
        "evidence_index",
      ],
    },
    cloudStorage: {
      bucketSuffix: "learning-path-recommendation-evidence",
      prefixes: [
        "documents",
        "audit-trails",
        "exports",
      ],
    },
    apis: {
      serviceName: "learning-path-recommendation-source-adapters",
      deploymentTarget: "cloud_run",
    },
  },
  validation: {
    smokePrompt: "Run the Learning Path Recommendation workflow and cite source-system evidence for every claim.",
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

export const LearningPathRecommendation = () => (
  <UseCaseSlide
    title="Learning Path Recommendation"
    subtitle="A-504 • L&D"
    icon={Compass}
    domainId="domain-5"
    layer="Layer 2: Agent Designer"
    persona="Employee"
    triggerType="chat"
    swimlane={swimlane}
    architecture={architecture}
    systems={["LMS", "Workday", "Udemy", "Coursera"]}
    kpis={[
      { label: "Path relevance", before: "Generic catalog", after: "Personalized" },
      { label: "Completion rates", before: "25%", after: "68%" },
      { label: "Skill acquisition speed", before: "6 months", after: "3 months" }
    ]}
    flow={flow}
    statusQuo={[
      "Learning paths are one-size-fits-all by role or department.",
      "No personalization based on individual skills or career aspirations.",
      "Low adoption of self-directed learning due to content overload."
    ]}
    agentification={[
      "Personalized paths recommended based on role, skills, and goals.",
      "Dynamic integration of internal LMS and external content libraries.",
      "Career-aligned learning nudges based on successor readiness."
    ]}
  />
);
