import { buildWorkflowFromPipeline } from "../agent-workflow.mjs";
import { snake } from "./systems.mjs";

// ── Behavior contract synthesis ─────────────────────────────────────────────

const ACTION_VERBS = [
  ["publish", "publish"], ["file", "file"], ["send", "send"], ["distribute", "distribute"],
  ["escalate", "escalate"], ["route", "route"], ["create ticket", "create_ticket"],
  ["create incident", "create_incident"], ["approve", "approve"], ["recommend", "recommend"],
  ["generate", "generate"], ["draft", "draft"], ["remediate", "remediate"],
  ["update", "update"], ["close", "close"], ["assign", "assign"], ["release", "release"],
  ["block", "block"], ["enrich", "enrich"], ["notify", "notify"],
  ["submit", "submit"], ["enroll", "enroll"], ["sync", "sync"], ["create", "create"],
  ["deploy", "deploy"], ["trigger", "trigger"], ["certify", "certify"], ["match", "match"],
  ["match", "match"], ["validate", "validate"], ["reconcile", "reconcile"], ["post", "post"],
  ["log", "log_entry"], ["archive", "archive"], ["expire", "expire"], ["onboard", "onboard"],
  ["provision", "provision"], ["revoke", "revoke"], ["promote", "promote"], ["roll back", "rollback"],
];

// Audit's regex for "writes external state" — keep in sync with audit-usecase-specs.mjs
const WRITES_STATE_RE = /(submit|enroll|ticket|sync|create|approve|notify|publish|deploy|update|escalat|trigger|certify|match|reconcil|post|provision|revoke|remediat|generat|file|distribut|send|route|draft|assign|release)/i;

export function pickAction(agentification, persona, title) {
  const text = (agentification || []).join(" ").toLowerCase() + " " + (persona || "").toLowerCase() + " " + (title || "").toLowerCase();
  for (const [needle, verb] of ACTION_VERBS) {
    if (text.includes(needle)) return verb;
  }
  // Fallback: if any state-change verb appears in the corpus, use a generic verb
  if (WRITES_STATE_RE.test(text)) return "execute";
  return null;
}

function deriveRole(useCase) {
  return `${useCase.persona || "Operator"} agent for the ${useCase.title} workflow`;
}

function deriveObjective(useCase) {
  const a0 = (useCase.agentification && useCase.agentification[0]) || "";
  const a1 = (useCase.agentification && useCase.agentification[1]) || "";
  const trimmed = `${a0} ${a1}`.replace(/\s+/g, " ").trim();
  const kpiLabel = useCase.kpis && useCase.kpis[0] ? useCase.kpis[0].label : "operational efficiency";
  let obj = `${trimmed || `Drive ${useCase.title} outcomes`} so the ${useCase.persona || "team"} can move the ${kpiLabel} KPI.`;
  // ensure ≥60 chars
  if (obj.length < 80) {
    obj = `${obj} The agent grounds every recommendation in source-system evidence and routes irreversible actions through human review.`;
  }
  return obj;
}

export function pickDocument(useCase) {
  const titleSlug = useCase.id;
  const dept = useCase.department;
  // Department-tuned document mapping
  const map = {
    finance: { id: `${titleSlug}-controls-playbook`, type: "policy", title: `${useCase.title} Controls Playbook`, sections: ["Workflow scope", "Materiality thresholds", "Escalation triggers", "Audit evidence requirements", "Quarter-end variations"], anchors: ["scope", "materiality", "escalation", "audit-evidence"] },
    hr: { id: `${titleSlug}-policy-handbook`, type: "policy", title: `${useCase.title} Policy Handbook`, sections: ["Eligibility and scope", "Workflow steps", "Manager responsibilities", "Compliance and audit", "Sensitive-data handling"], anchors: ["eligibility", "workflow", "compliance", "sensitive-data"] },
    it: { id: `${titleSlug}-runbook`, type: "runbook", title: `${useCase.title} Operations Runbook`, sections: ["Detection signals", "Triage procedures", "Remediation actions", "Rollback criteria", "Post-incident review"], anchors: ["detection", "triage", "remediation", "rollback"] },
    marketing: { id: `${titleSlug}-playbook`, type: "playbook", title: `${useCase.title} Playbook`, sections: ["Audience guidelines", "Brand voice rules", "Channel-specific guardrails", "Measurement framework", "Approval thresholds"], anchors: ["audience", "brand-voice", "channels", "approvals"] },
    procurement: { id: `${titleSlug}-policy-guide`, type: "policy", title: `${useCase.title} Procurement Policy Guide`, sections: ["Sourcing principles", "Approval thresholds", "Supplier risk requirements", "Contract and compliance gates", "Exception handling"], anchors: ["sourcing", "approvals", "supplier-risk", "exceptions"] },
  };
  return map[dept] || map.it;
}

function deriveScope(useCase) {
  const ag = useCase.agentification || [];
  const sq = useCase.statusQuo || [];
  const inScope = ag.slice(0, 4).map((s) => s.replace(/\.$/, ""));
  if (inScope.length === 0) {
    inScope.push(
      `Run the ${useCase.title} workflow end-to-end and cite source-system evidence`,
      `Surface escalation candidates to ${useCase.persona || "operator"} with full audit trail`,
    );
  }
  const dept = useCase.department;
  const outOfScopeBase = {
    finance: [
      "Final sign-off on materially significant journal entries (Controller retains authority)",
      "Restatement of prior-period filings",
      "Tax position changes that require external advisor review",
    ],
    hr: [
      "Final hiring, termination, or compensation decisions (HRBP/leadership retains authority)",
      "Performance management adjudication and disciplinary action",
      "Legal interpretation of employment law in ambiguous jurisdictions",
    ],
    it: [
      "Production deployments outside an approved change window",
      "Irreversible destructive actions on shared infrastructure (DROP, force-delete, key rotation)",
      "Security incident attribution requiring forensics",
    ],
    marketing: [
      "Final approval of paid spend reallocations above the governance threshold",
      "Trademark, legal, or regulated-industry claim approval",
      "Crisis communications without comms-team sign-off",
    ],
    procurement: [
      "Contract execution without legal review",
      "Supplier disqualification decisions (category lead retains authority)",
      "Single-source justification overrides above policy threshold",
    ],
  };
  const outOfScope = outOfScopeBase[dept] || outOfScopeBase.it;
  return { inScope, outOfScope };
}

export function generateBehaviorContract(useCase, sourceSystems) {
  const kpis = useCase.kpis || [];
  const persona = useCase.persona || "Operator";
  const actionVerb = pickAction(useCase.agentification, persona, useCase.title);
  const docMeta = pickDocument(useCase);
  const docId = docMeta.id;
  const primarySystem = sourceSystems[0];
  const lookupSystem = sourceSystems.find((s) => /bigquery|cloud-storage/.test(s.localBacking?.[0])) || primarySystem;
  const actionSystem = sourceSystems.find((s) => !/bigquery/.test(s.localBacking?.[0])) || primarySystem;

  const toolIntents = [];

  // One query per source system (capped at 4 to keep contract focused)
  for (const sys of sourceSystems.slice(0, 4)) {
    const entity = sys.owns[0];
    toolIntents.push({
      name: `query_${sys.id}_${entity}`,
      kind: "query",
      sourceSystemId: sys.id,
      description: `Retrieve ${entity.replace(/_/g, " ")} from ${sys.name} for the ${useCase.title} workflow.`,
      requiredInputs: ["lookup_key", "date_range"],
      produces: [`${entity}_records`, `${entity}_summary`],
      evidenceEmitted: sys.localBacking?.[0] === "bigquery" ? ["sql_result"] : ["source_system_record"],
    });
  }

  // Evidence lookup
  toolIntents.push({
    name: `lookup_${snake(docId)}`,
    kind: "evidence_lookup",
    sourceSystemId: lookupSystem.id,
    description: `Look up sections of the ${docMeta.title} to cite in narrative output, escalation rationale, and audit evidence.`,
    requiredInputs: ["section_anchor"],
    produces: ["document_section", "citation_anchor"],
    evidenceEmitted: ["document_reference"],
  });

  // Action intent if state-changing
  if (actionVerb) {
    toolIntents.push({
      name: `action_${actionSystem.id}_${actionVerb}`,
      kind: "action",
      sourceSystemId: actionSystem.id,
      description: `Execute the ${actionVerb.replace(/_/g, " ")} step in ${actionSystem.name} after the agent has gathered evidence and validated escalation gates.`,
      requiredInputs: ["target_id", "rationale"],
      produces: ["action_id", "audit_record_id"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    });
  }

  // Evidence requirements from KPIs
  const evidenceRequirements = kpis.slice(0, 2).map((kpi, i) => ({
    claim: `${kpi.label} moved from ${kpi.before} toward ${kpi.after}`,
    mustCite: sourceSystems.slice(0, 2).map((s) => `${s.id}.${s.owns[0]}`),
    sourceSystemIds: sourceSystems.slice(0, 2).map((s) => s.id),
  }));
  if (evidenceRequirements.length === 0) {
    evidenceRequirements.push({
      claim: `The ${useCase.title} workflow produced an actionable recommendation`,
      mustCite: sourceSystems.slice(0, 2).map((s) => `${s.id}.${s.owns[0]}`),
      sourceSystemIds: sourceSystems.slice(0, 2).map((s) => s.id),
    });
  }

  // Escalation rules
  const escalationRules = [
    {
      trigger: kpis[0] ? `${kpis[0].label} regresses past the ${kpis[0].before} baseline by more than 20%` : "Workflow output exceeds historical baseline by more than 20%",
      action: "escalate_to_human",
      handoffTarget: persona,
      rationale: "Significant regressions need human judgment before automated remediation runs against production records.",
    },
    {
      trigger: "Source-system evidence is incomplete or stale (>24h) for any required entity",
      action: "request_more_info",
      rationale: "Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility.",
    },
  ];
  if (actionVerb) {
    escalationRules.push({
      trigger: `Proposed ${actionVerb.replace(/_/g, " ")} action lacks supporting evidence from at least two systems`,
      action: "refuse",
      rationale: "Single-system evidence is insufficient to authorize external state changes without manual review.",
    });
  }

  // Refusal rules
  const refusalRules = [
    `Never fabricate metric values; only publish numbers derived from ${sourceSystems[0].name} (and other named systems) entities.`,
    `Never bypass ${persona} approval on escalation triggers, even when confidence is high.`,
    "Never expose individual personal data (PII) in summaries; aggregate or pseudonymise before output.",
    "Never act on data older than the staleness threshold defined in the runbook without a fresh re-query.",
  ];

  // Golden eval(s)
  const goldenEvals = [
    {
      id: `${useCase.id}-end-to-end`,
      prompt: `Run the ${useCase.title} workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.`,
      expectedToolCalls: toolIntents.map((t) => t.name),
      mustReferenceEntities: sourceSystems.flatMap((s) => s.owns.slice(0, 1)),
      mustCiteDocuments: [docId],
      expectedActionOutcome: actionVerb
        ? `Action ${actionVerb.replace(/_/g, " ")} executed against ${actionSystem.name}, with audit-trail entry and ${persona} notified of outcomes.`
        : `${persona} receives a fully-cited recommendation; no external state change without explicit approval.`,
      forbiddenBehaviors: [
        "do not invent KPI numbers",
        "do not skip the evidence_lookup step before any recommendation",
        actionVerb ? `do not execute ${actionVerb.replace(/_/g, " ")} without two-system evidence` : "do not act on single-system evidence",
      ],
    },
  ];

  const { inScope, outOfScope } = deriveScope(useCase);

  // Self-describing workflow: when the use case has a real multi-stage pipeline,
  // emit an explicit behaviorContract.workflow (steps + tool intents per step) so
  // the spec aligns with the multi-agent generator without it having to re-derive
  // the topology. Single source of truth: scripts/factory/agent-workflow.mjs.
  const workflow = buildWorkflowFromPipeline({
    behaviorContract: { toolIntents },
    architecture: useCase.architecture,
  });

  return {
    role: deriveRole(useCase),
    primaryObjective: deriveObjective(useCase),
    inScope,
    outOfScope,
    toolIntents,
    ...(workflow ? { workflow } : {}),
    evidenceRequirements,
    escalationRules,
    refusalRules,
    goldenEvals,
  };
}
