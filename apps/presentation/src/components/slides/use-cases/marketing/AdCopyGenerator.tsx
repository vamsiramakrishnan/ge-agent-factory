import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, AgentBehaviorContract, UseCaseGenerationSpec } from "../../../../types/architecture";
import { PenTool, Zap, BarChart3, FileText, CheckCircle } from "lucide-react";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Campaign Created", lane: "system", type: "trigger" },
    { id: "a1", label: "Brief Analysis", lane: "agent", type: "action" },
    { id: "a2", label: "Copy Generation", lane: "agent", type: "action" },
    { id: "a3", label: "A/B Test Setup", lane: "agent", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "a3"]],
};

const flow: FlowStep[] = [
  { label: "Campaign Trigger", icon: Zap, description: "New campaign or creative refresh request triggers ad copy generation.", trigger: "Event", systems: ["Google Ads", "Meta Ads"] },
  { label: "Brief Interpretation", icon: FileText, description: "LLM analyzes campaign brief, target audience, and funnel stage to determine messaging angles.", systems: ["Vertex AI"] },
  { label: "Copy Variants", icon: PenTool, description: "Generate platform-specific copy variations — RSA headlines, social ad text, LinkedIn messaging.", systems: ["Vertex AI"] },
  { label: "Test Deployment", icon: BarChart3, description: "Push variants to ad platforms with A/B test configuration. Track and scale winners.", output: "Ad Copy Variants" },
];

const architecture: AgentArchitecture = {
  connections: [
    { system: "Google Ads", description: "RSA headlines/descriptions, performance data, character limits", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "Meta Ads Manager", description: "Social ad copy, creative formats, audience targeting", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "LinkedIn Ads", description: "Professional ad copy, sponsored content, InMail templates", direction: "bidirectional", protocol: "REST API", category: "analytics" },
    { system: "Vertex AI (Gemini)", description: "Ad copy generation, messaging angle adaptation, tone adjustment", direction: "bidirectional", protocol: "gRPC", category: "ai" },
    { system: "BigQuery", description: "Historical ad performance, creative element analysis", direction: "read", protocol: "BigQuery SQL", category: "analytics" },
  ],
  pipeline: [
    { label: "Campaign Brief Intake", description: "Receive campaign brief with target audience, funnel stage, value proposition, and platform targets. Pull historical creative performance from BigQuery for context.", systems: ["Google Ads", "Meta Ads Manager", "BigQuery"], layer: "integration", dataIn: "Campaign brief + historical performance", dataOut: "Structured creative requirements" },
    { label: "Creative Performance Analysis", description: "Analyze which messaging angles, CTAs, and psychological triggers (curiosity, urgency, social proof) have performed best for similar campaigns and audience segments.", systems: ["BigQuery"], layer: "ml", dataIn: "Historical creative data", dataOut: "Performance patterns by segment and platform" },
    { label: "Copy Generation & Adaptation", description: "Gemini generates platform-specific ad copy fitting constraints (Google RSA limits, LinkedIn professional tone). Adapts messaging for different audience segments and funnel stages.", systems: ["Vertex AI (Gemini)"], layer: "llm", dataIn: "Requirements + performance patterns", dataOut: "Multi-variant ad copy per platform" },
    { label: "Test Deployment", description: "Push generated copy variants to ad platforms. Configure A/B tests, track performance metrics, pause underperformers, and scale winning variants automatically.", systems: ["Google Ads", "Meta Ads Manager", "LinkedIn Ads"], layer: "integration", dataIn: "Approved ad copy variants", dataOut: "Live ad tests + performance tracking" },
  ],
};

const behaviorContract: AgentBehaviorContract = {
  role: "Ad creative copilot for GE digital marketing teams",
  primaryObjective: "Ingest campaign brief, analyze historical creative performance, generate platform-tailored ad copy variants compliant with brand voice, publish to ad platforms with A/B test configuration, and recommend scaling winners based on performance data.",
  inScope: [
    "Campaign brief interpretation and target audience analysis",
    "Historical creative performance analysis from BigQuery",
    "Platform-specific ad copy generation (Google RSA, Meta social, LinkedIn professional)",
    "Brand voice compliance checking against policy documentation",
    "A/B test deployment and winner scaling recommendations",
  ],
  outOfScope: [
    "Budget allocation or spend changes across platforms",
    "Audience targeting changes or demographic adjustments",
    "Responding to ad replies or managing customer comments",
    "Crisis communications or public relations copy",
    "Claims that violate platform policy or regulatory requirements",
  ],
  toolIntents: [
    {
      name: "query_google_ads_rsa_performance",
      kind: "query",
      sourceSystemId: "google_ads",
      description: "Retrieve Google Ads RSA performance metrics, headline/description combinations, and character limit constraints.",
      requiredInputs: ["campaign_id"],
      produces: ["rsa_performance_data", "character_limits"],
      evidenceEmitted: ["sql_result", "source_system_record"],
    },
    {
      name: "query_google_ads_character_limits",
      kind: "query",
      sourceSystemId: "google_ads",
      description: "Look up platform-specific character limits for RSA headlines and descriptions.",
      requiredInputs: ["format_type"],
      produces: ["character_limit_spec"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_meta_ads_manager_creative_performance",
      kind: "query",
      sourceSystemId: "meta_ads_manager",
      description: "Fetch Meta Ads Manager creative performance data, engagement metrics, and audience response patterns.",
      requiredInputs: ["campaign_id"],
      produces: ["creative_performance", "audience_response"],
      evidenceEmitted: ["sql_result", "source_system_record"],
    },
    {
      name: "query_linkedin_ads_sponsored_content",
      kind: "query",
      sourceSystemId: "linkedin_ads",
      description: "Retrieve LinkedIn Ads sponsored content performance and professional tone requirements.",
      requiredInputs: ["campaign_id"],
      produces: ["linkedin_performance", "tone_guidance"],
      evidenceEmitted: ["sql_result", "source_system_record"],
    },
    {
      name: "query_bigquery_historical_creative_performance",
      kind: "query",
      sourceSystemId: "bigquery",
      description: "Analyze historical creative performance data to identify winning messaging angles, CTAs, and psychological triggers by segment.",
      requiredInputs: ["segment", "platform"],
      produces: ["performance_patterns", "winning_angles"],
      evidenceEmitted: ["sql_result"],
    },
    {
      name: "action_google_ads_publish_rsa_variants",
      kind: "action",
      sourceSystemId: "google_ads",
      description: "Publish generated RSA headline and description variants to Google Ads campaign.",
      requiredInputs: ["campaign_id", "variants"],
      produces: ["variant_ids", "campaign_link"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_meta_ads_manager_publish_creative",
      kind: "action",
      sourceSystemId: "meta_ads_manager",
      description: "Publish creative variants to Meta Ads Manager for social platform deployment.",
      requiredInputs: ["campaign_id", "creative_content"],
      produces: ["creative_ids", "ad_link"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_linkedin_ads_publish_sponsored_content",
      kind: "action",
      sourceSystemId: "linkedin_ads",
      description: "Publish professional ad copy to LinkedIn Ads platform.",
      requiredInputs: ["campaign_id", "copy_variant"],
      produces: ["sponsored_content_id", "ad_link"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_ads_create_ab_test",
      kind: "action",
      sourceSystemId: "google_ads",
      description: "Configure A/B tests across platforms with variant assignment and performance tracking setup.",
      requiredInputs: ["variant_a_id", "variant_b_id"],
      produces: ["ab_test_id", "tracking_setup"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "evidence_brand_voice_compliance",
      kind: "evidence_lookup",
      sourceSystemId: "google_ads",
      description: "Cite brand voice and compliance policy for tone, messaging guardrails, and prohibited claims.",
      requiredInputs: ["citation_anchor"],
      produces: ["compliance_citation"],
      evidenceEmitted: ["document_reference"],
    },
    {
      name: "evidence_performance_tested_library",
      kind: "evidence_lookup",
      sourceSystemId: "bigquery",
      description: "Cite performance-tested creative library for winning headline templates, CTAs, and audience triggers.",
      requiredInputs: ["citation_anchor"],
      produces: ["creative_citation"],
      evidenceEmitted: ["document_reference"],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Copy variant matches platform character limits",
      mustCite: ["creative_variants.headline", "creative_variants.body", "character-limits"],
      sourceSystemIds: ["google_ads"],
    },
    {
      claim: "Messaging angle based on historical performance",
      mustCite: ["historical_performance.headline_template", "historical_performance.ctr", "historical_performance.conversions"],
      sourceSystemIds: ["bigquery"],
    },
    {
      claim: "Copy complies with brand voice policy",
      mustCite: ["brand_voice_rules.must_use", "brand_voice_rules.must_avoid", "brand-tone", "prohibited-claims"],
      sourceSystemIds: ["google_ads"],
    },
    {
      claim: "A/B test configuration ready for deployment",
      mustCite: ["ab_tests.variant_id_a", "ab_tests.variant_id_b", "ab_tests.started_at"],
      sourceSystemIds: ["google_ads"],
    },
  ],
  escalationRules: [
    {
      trigger: "Generated copy contains brand voice rule violation (must_avoid clause)",
      action: "refuse",
      rationale: "Brand voice violations must never be published; cite brand_voice_rules and ask agent to regenerate copy.",
    },
    {
      trigger: "Copy exceeds platform-specific character limits",
      action: "request_more_info",
      handoffTarget: "Campaign Manager",
      rationale: "Character overages must be resolved before publishing; request shorter copy variant or permission to trim.",
    },
    {
      trigger: "Copy makes regulated claims (financial projections, health benefits) without legal citation",
      action: "escalate_to_human",
      handoffTarget: "Legal & Compliance",
      rationale: "Regulated industry claims require legal review before any ad platform publication.",
    },
    {
      trigger: "A/B test winner has confidence score <0.7",
      action: "request_more_info",
      handoffTarget: "Campaign Manager",
      rationale: "Low-confidence winners should not auto-scale; request manual review or extended test duration.",
    },
    {
      trigger: "Creative performance data not available for platform",
      action: "use_fallback_tool",
      rationale: "Fall back to brand voice policy and historical cross-platform patterns if platform-specific data is missing.",
    },
  ],
  refusalRules: [
    "Never invent performance numbers, CTR, or conversion metrics — only cite data returned by query tools.",
    "Never publish ad copy without brand voice compliance check against brand_voice_rules document.",
    "Never claim regulatory compliance (financial safety, health claims) without legal citation.",
    "Never publish copy that violates platform policy (unverified claims, misleading content).",
    "Never bypass character limit validation for any platform.",
  ],
  goldenEvals: [
    {
      id: "multi-platform-happy-path",
      prompt: "Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.",
      expectedToolCalls: [
        "query_bigquery_historical_creative_performance",
        "query_google_ads_character_limits",
        "query_meta_ads_manager_creative_performance",
        "query_linkedin_ads_sponsored_content",
        "evidence_brand_voice_compliance",
        "evidence_performance_tested_library",
        "action_google_ads_publish_rsa_variants",
        "action_meta_ads_manager_publish_creative",
        "action_linkedin_ads_publish_sponsored_content",
        "action_ads_create_ab_test",
      ],
      mustReferenceEntities: ["campaign_briefs", "creative_variants", "ab_tests", "historical_performance"],
      mustCiteDocuments: ["brand-voice-and-compliance-policy", "performance-tested-creative-library"],
      expectedActionOutcome: "Multi-platform ad copy deployed with A/B test configuration active and winner recommendation provided.",
      forbiddenBehaviors: [
        "do not invent performance metrics",
        "do not publish copy without brand voice check",
        "do not exceed character limits",
      ],
    },
    {
      id: "brand-voice-violation-refusal",
      prompt: "I want to generate ad copy claiming GE industrial software achieves 50% cost savings guaranteed. Is this something you can write?",
      expectedToolCalls: [
        "evidence_brand_voice_compliance",
      ],
      mustCiteDocuments: ["brand-voice-and-compliance-policy"],
      expectedActionOutcome: "Refuse the request, cite the brand_voice_rules prohibiting unverified financial claims, and suggest customer-testimonial-based angle instead.",
      forbiddenBehaviors: [
        "do not generate the unverified claim",
        "do not proceed to publishing steps",
      ],
    },
    {
      id: "regulated-claim-escalation",
      prompt: "Create ad copy for a new GE healthcare analytics product. The brief claims it reduces patient wait times by 40% and improves diagnostic accuracy by 35%. Can you generate copy from this?",
      expectedToolCalls: [
        "evidence_brand_voice_compliance",
      ],
      mustCiteDocuments: ["brand-voice-and-compliance-policy"],
      expectedActionOutcome: "Escalate to Legal & Compliance, cite the health-claim restrictions in brand_voice_rules, and request legal review before proceeding.",
      forbiddenBehaviors: [
        "do not generate healthcare efficacy claims without legal review",
        "do not publish unverified health benefits",
      ],
    },
  ],
};

const generationSpec: UseCaseGenerationSpec = {
  version: 1,
  rowPolicy: {
    defaultRowsPerEntity: 50,
    minimumRowsPerEntity: 20,
    seed: 43,
    rationale: "Ad copy generation needs sufficient campaign briefs, creative variants, and historical performance records to demonstrate platform-specific adaptation, A/B test wiring, and winner scaling without becoming data-heavy.",
  },
  sourceSystems: [
    {
      id: "google_ads",
      name: "Google Ads",
      owns: ["rsa_headlines", "character_limits", "campaign_metadata", "ab_test_config"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_google_ads_rsa_performance", "query_google_ads_character_limits", "action_google_ads_publish_rsa_variants", "action_ads_create_ab_test"],
      mcpToolNames: ["google_ads_get_performance", "google_ads_publish_variant"],
      evidence: ["source_system_record", "sql_result", "api_response"],
    },
    {
      id: "meta_ads_manager",
      name: "Meta Ads Manager",
      owns: ["creative_formats", "audience_segments", "engagement_metrics"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_meta_ads_manager_creative_performance", "action_meta_ads_manager_publish_creative"],
      mcpToolNames: ["meta_ads_get_creative", "meta_ads_publish_creative"],
      evidence: ["source_system_record", "sql_result", "api_response"],
    },
    {
      id: "linkedin_ads",
      name: "LinkedIn Ads",
      owns: ["sponsored_content", "professional_messaging", "b2b_targeting"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_linkedin_ads_sponsored_content", "action_linkedin_ads_publish_sponsored_content"],
      mcpToolNames: ["linkedin_ads_get_performance", "linkedin_ads_publish_content"],
      evidence: ["source_system_record", "sql_result", "api_response"],
    },
    {
      id: "bigquery",
      name: "BigQuery",
      owns: ["historical_creative_performance", "segment_analytics", "performance_scoring"],
      protocol: "BigQuery SQL",
      localBacking: ["bigquery"],
      toolNames: ["query_bigquery_historical_creative_performance"],
      mcpToolNames: ["bigquery_query_performance"],
      evidence: ["sql_result"],
    },
  ],
  entities: [
    {
      name: "campaign_briefs",
      sourceSystemId: "google_ads",
      datastore: "alloydb",
      rowCount: 35,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "campaign_name", type: "lorem.sentence", required: true },
        { name: "target_audience", type: "lorem.sentence", required: true },
        { name: "funnel_stage", type: "enum", values: ["awareness", "consideration", "conversion", "retention"], weights: [0.3, 0.3, 0.25, 0.15], required: true },
        { name: "value_prop", type: "lorem.sentence", required: true },
        { name: "platforms", type: "json", required: true },
      ],
    },
    {
      name: "creative_variants",
      sourceSystemId: "google_ads",
      datastore: "alloydb",
      rowCount: 140,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "brief_id", type: "ref", ref: "campaign_briefs.id", required: true },
        { name: "platform", type: "enum", values: ["google_rsa", "meta_social", "linkedin_professional"], required: true },
        { name: "headline", type: "lorem.sentence", required: true },
        { name: "body", type: "lorem.paragraph", required: true },
        { name: "cta", type: "lorem.words", required: true },
        { name: "status", type: "enum", values: ["draft", "brand_approved", "published", "archived"], required: true },
      ],
    },
    {
      name: "ab_tests",
      sourceSystemId: "google_ads",
      datastore: "alloydb",
      rowCount: 40,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "variant_id_a", type: "ref", ref: "creative_variants.id", required: true },
        { name: "variant_id_b", type: "ref", ref: "creative_variants.id", required: true },
        { name: "started_at", type: "date.past", required: true },
        { name: "winner_variant_id", type: "ref", ref: "creative_variants.id" },
      ],
    },
    {
      name: "historical_performance",
      sourceSystemId: "bigquery",
      datastore: "bigquery",
      rowCount: 200,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "platform", type: "enum", values: ["google_rsa", "meta_social", "linkedin_professional"], required: true },
        { name: "segment", type: "enum", values: ["cold_awareness", "warm_consideration", "hot_conversion"], required: true },
        { name: "headline_template", type: "lorem.sentence", required: true },
        { name: "ctr", type: "float", min: 0.5, max: 8.5, decimals: 2, required: true },
        { name: "conversions", type: "number", min: 10, max: 500, required: true },
        { name: "performance_score", type: "number", min: 0, max: 100, required: true },
      ],
    },
    {
      name: "brand_voice_rules",
      sourceSystemId: "google_ads",
      datastore: "alloydb",
      rowCount: 25,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "category", type: "enum", values: ["tone", "claims", "vocabulary", "compliance"], required: true },
        { name: "must_use", type: "lorem.sentence", required: true },
        { name: "must_avoid", type: "lorem.sentence", required: true },
        { name: "citation", type: "lorem.words" },
      ],
    },
  ],
  relationships: [
    { from: "creative_variants.brief_id", to: "campaign_briefs.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "ab_tests.variant_id_a", to: "creative_variants.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "ab_tests.variant_id_b", to: "creative_variants.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "ab_tests.winner_variant_id", to: "creative_variants.id", cardinality: "many-to-one", orphanPolicy: "allowed" },
  ],
  documents: [
    {
      id: "brand-voice-and-compliance-policy",
      sourceSystemId: "google_ads",
      type: "policy",
      title: "GE Brand Voice & Compliance Policy",
      requiredSections: ["Tone & messaging", "Prohibited claims", "Regulated industries guidance", "Platform-specific guidelines"],
      linkedEntities: ["creative_variants", "brand_voice_rules"],
      minimumWordCount: 600,
      citationAnchors: ["brand-tone", "prohibited-claims", "character-limits", "platform-best-practices"],
    },
    {
      id: "performance-tested-creative-library",
      sourceSystemId: "bigquery",
      type: "knowledge_base",
      title: "Performance-Tested Creative Library",
      requiredSections: ["Winning headlines by segment", "CTA patterns", "Psychological triggers", "Platform-specific templates"],
      linkedEntities: ["creative_variants", "historical_performance"],
      minimumWordCount: 500,
      citationAnchors: ["winning-headlines", "cta-patterns", "psychological-triggers", "segment-insights"],
    },
  ],
  apis: [
    {
      systemId: "google_ads",
      operation: "publish_rsa_variants",
      method: "POST",
      path: "/systems/google-ads/rsa-variants",
      requestSchema: { campaign_id: "string", variants: "array" },
      responseSchema: { variant_ids: "array", campaign_link: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/google_ads_publish_rsa.json",
      mcpToolName: "google_ads_publish_variant",
    },
    {
      systemId: "meta_ads_manager",
      operation: "publish_creative",
      method: "POST",
      path: "/systems/meta-ads/creative",
      requestSchema: { campaign_id: "string", creative_content: "object" },
      responseSchema: { creative_ids: "array", ad_link: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/meta_ads_publish_creative.json",
      mcpToolName: "meta_ads_publish_creative",
    },
    {
      systemId: "linkedin_ads",
      operation: "publish_sponsored_content",
      method: "POST",
      path: "/systems/linkedin-ads/sponsored-content",
      requestSchema: { campaign_id: "string", copy_variant: "object" },
      responseSchema: { sponsored_content_id: "string", ad_link: "string", status: "string" },
      fixture: "mock_data/apis/fixtures/linkedin_ads_publish_content.json",
      mcpToolName: "linkedin_ads_publish_content",
    },
  ],
  anomalies: [
    {
      id: "brand-voice-violation-in-generated-copy",
      description: "Generated copy contains prohibited claims or violates brand tone guidelines without detection.",
      affectedEntities: ["creative_variants", "brand_voice_rules"],
      discoveryPath: ["Generate copy variant", "Compare against brand_voice_rules.must_avoid", "Scan for unverified claims", "Flag for compliance review"],
      expectedEvidence: ["Generated copy text", "brand_voice_rules citation", "compliance violation log"],
      expectedRecommendation: "Regenerate copy with brand-tone and prohibited-claims anchors; escalate to compliance review before publishing.",
    },
  ],
  datastorePackaging: {
    alloydb: { database: "marketing_creative", schemas: ["google_ads", "meta_ads", "linkedin_ads"] },
    bigquery: { dataset: "marketing_creative_analytics", tables: ["rsa_performance", "ab_test_results", "brand_voice_audit"] },
    cloudStorage: { bucketSuffix: "marketing-creative-evidence", prefixes: ["documents/brand", "audit-trails", "ab-test-results"] },
    apis: { serviceName: "marketing-creative-source-adapters", deploymentTarget: "cloud_run" },
  },
  behaviorContract,
  validation: {
    smokePrompt: "Generate platform-specific ad copy for a GE digital transformation campaign targeting enterprise CIOs. Value prop: 60% faster time-to-value. Create RSA headlines, Meta social copy, and LinkedIn professional messaging. Setup A/B tests.",
    expectedAnswer: ["cites BigQuery historical performance", "respects platform character limits", "applies brand voice rules", "publishes to all three platforms", "configures A/B test"],
    assertions: ["all tool names use canonical system ids", "all creative variants reference campaign briefs", "ab_tests foreign keys resolve", "brand voice compliance check is performed", "at least two documents are cited"],
  },
};

export const AdCopyGenerator = () => (
  <UseCaseSlide
    title="Ad Copy Generator & Tester"
    subtitle="A-3204 • Digital Marketing & SEO/SEM"
    icon={PenTool}
    domainId="domain-32"
    layer="Layer 1: OOTB"
    persona="Digital Marketing Mgr"
    systems={["Google Ads", "Meta Ads Manager", "LinkedIn Ads", "Vertex AI"]}
    kpis={[
      { label: "Copy creation time", before: "2-3 hours/campaign", after: "15 minutes" },
      { label: "Variants tested", before: "3-4 manual", after: "15+ automated" },
      { label: "CTR improvement", before: "Baseline", after: "+18% avg" },
    ]}
    triggerType="event"
    swimlane={swimlane}
    flow={flow}
    architecture={architecture}
    generationSpec={generationSpec}
    statusQuo={[
      "Ad copy written manually per platform with inconsistent messaging across channels.",
      "A/B testing limited to 2-3 variants due to time constraints on copy creation.",
      "Creative refresh cycles slow — fatigued ads run too long before replacement."
    ]}
    agentification={[
      "Gemini generates platform-specific ad copy respecting character limits, tone, and audience context.",
      "Automatic variant generation with built-in A/B test setup and winner scaling.",
      "Messaging adapted by funnel stage — remarketing gets ROI proof points, cold audience gets pain recognition."
    ]}
  />
);
