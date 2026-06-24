import React from "react";
import { UseCaseSlide } from "../../../agent/UseCaseSlide";
import { Calendar, Users, Clock, CheckCircle } from "lucide-react";
import { FlowStep } from "../../../agent/ProcessFlow";
import { SwimlaneFlow } from "../../../agent/SwimlaneFlow";
import { AgentArchitecture, AgentBehaviorContract, UseCaseGenerationSpec } from "../../../../types/architecture";

const swimlane: SwimlaneFlow = {
  nodes: [
    { id: "s1", label: "Shortlist Ready", lane: "system", type: "trigger" },
    { id: "a1", label: "Calendar Scan", lane: "agent", type: "action" },
    { id: "a2", label: "Auto-Schedule", lane: "agent", type: "action" },
    { id: "s2", label: "Invites Sent", lane: "system", type: "output" },
  ],
  connections: [["s1", "a1"], ["a1", "a2"], ["a2", "s2"]],
};

const architecture: AgentArchitecture = {
  connections: [
    { system: "Greenhouse", description: "Interview panel requirements, candidate stage, scheduling rules", direction: "bidirectional", protocol: "REST API", category: "erp" },
    { system: "Google Calendar", description: "Interviewer availability, room bookings, time zone handling", direction: "bidirectional", protocol: "Workspace API", category: "collaboration" },
    { system: "Workday", description: "Interviewer roles, team assignments, org context", direction: "read", protocol: "REST API", category: "erp" },
  ],
  pipeline: [
    { label: "Panel & Availability", description: "Identify required interviewers from Greenhouse stage configuration. Scan Google Calendar for availability across panelists and candidate.", systems: ["Greenhouse", "Google Calendar", "Workday"], layer: "integration", dataIn: "Interview panel + calendar data", dataOut: "Available time slots across all participants" },
    { label: "Optimal Scheduling", description: "Algorithm selects optimal interview slots considering time zones, buffer time, room availability, and interviewer load balancing.", systems: ["Google Calendar"], layer: "ml", dataIn: "Available slots + scheduling constraints", dataOut: "Optimized interview schedule" },
    { label: "Booking & Confirmation", description: "Calendar events created with video conferencing links, prep materials attached, and confirmation sent to all participants.", systems: ["Google Calendar", "Greenhouse"], layer: "integration", dataIn: "Optimized schedule + prep materials", dataOut: "Confirmed interviews with invites sent" },
  ],
};

const behaviorContract: AgentBehaviorContract = {
  role: "Interview scheduling coordinator for GE talent acquisition and multi-panel interview logistics",
  primaryObjective: "Scan Greenhouse for interview panel requirements and candidate stage, query Google Calendar for all panelists and candidate availability across time zones, book optimal slots with buffer time and Zoom links, send confirmations with prep materials, reschedule on conflicts, and log events in Greenhouse — never invent Zoom links, never override hiring manager calendar holds, never schedule outside business hours without explicit override.",
  inScope: [
    "Querying Greenhouse for interview panel composition and candidate availability status",
    "Scanning Google Calendar across multiple interviewer and candidate time zones",
    "Selecting optimal slots with configurable buffer time (default 15 min) and lunch-hour avoidance",
    "Creating Zoom-enabled calendar events with attendee lists and prep material attachments",
    "Sending interview confirmations to all panelists and candidate with prep materials",
    "Auto-rescheduling on single conflict (interviewer unavailable, double-booked, travel flag)",
    "Logging scheduled interviews back to Greenhouse with event IDs and Zoom link",
  ],
  outOfScope: [
    "Changing interview panel composition or substituting panelists without hiring manager approval",
    "Overriding hiring manager calendar holds or mandatory meeting blocks",
    "Scheduling offer interviews or debrief sessions (only standard stage interviews)",
    "Answering candidate technical questions or providing interview prep coaching",
    "Modifying candidate stage in Greenhouse (read-only for scheduling context)",
  ],
  toolIntents: [
    {
      name: "query_greenhouse_candidates",
      kind: "query",
      sourceSystemId: "greenhouse",
      description: "Retrieve candidate profile, requisition, and current stage to determine interview timing and panel requirements.",
      requiredInputs: ["candidate_id"],
      produces: ["candidate_record", "current_stage", "requisition_id"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_greenhouse_interview_panels",
      kind: "query",
      sourceSystemId: "greenhouse",
      description: "List required panelists for the current interview stage, their roles, and any scheduling constraints (do-not-schedule flags, travel holds).",
      requiredInputs: ["requisition_id", "interview_stage"],
      produces: ["panel_members", "panel_member_roles", "scheduling_constraints"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_workday_interviewers",
      kind: "query",
      sourceSystemId: "workday",
      description: "Resolve interviewer time zones, office locations, and any 'do not schedule' flags or travel blocks from Workday org data.",
      requiredInputs: ["interviewer_id_list"],
      produces: ["interviewer_profiles", "time_zones", "office_locations", "travel_flags"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "query_google_calendar_availability",
      kind: "query",
      sourceSystemId: "google_calendar",
      description: "Find free slots across all panelists and candidate within a 5-day window, respecting time zones and 15-minute buffer slots.",
      requiredInputs: ["attendee_emails", "time_zone_list", "preferred_date_range"],
      produces: ["available_slots", "conflict_summary"],
      evidenceEmitted: ["source_system_record"],
    },
    {
      name: "action_google_calendar_create_event",
      kind: "action",
      sourceSystemId: "google_calendar",
      description: "Create a calendar event with all panelists and candidate, attach Zoom link, and include prep materials as event description or attachment.",
      requiredInputs: ["event_title", "start_time", "attendee_emails", "zoom_link", "prep_materials_link"],
      produces: ["event_id", "zoom_link", "calendar_invite_id"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "action_greenhouse_log_scheduled_interview",
      kind: "action",
      sourceSystemId: "greenhouse",
      description: "Update Greenhouse with scheduled interview event ID, Zoom link, and confirmation timestamp to close the scheduling workflow.",
      requiredInputs: ["candidate_id", "interview_stage", "event_id", "zoom_link"],
      produces: ["scheduled_interview_record"],
      evidenceEmitted: ["api_response", "generated_audit_trail"],
    },
    {
      name: "evidence_interview_panel_policy",
      kind: "evidence_lookup",
      sourceSystemId: "greenhouse",
      description: "Cite the interview panel composition policy for panel size, role requirements, and conflict-of-interest rules (citation anchors: panel-size, required-roles, coi-rules).",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
    {
      name: "evidence_scheduling_etiquette_sop",
      kind: "evidence_lookup",
      sourceSystemId: "greenhouse",
      description: "Cite the scheduling etiquette SOP for buffer time, time zone rules, and reschedule windows (citation anchors: timezone-buffer, lunch-hold, reschedule-window, candidate-prep).",
      requiredInputs: ["citation_anchor"],
      produces: ["document_citation"],
      evidenceEmitted: ["document_reference"],
    },
  ],
  evidenceRequirements: [
    {
      claim: "Interview panel is valid and complete",
      mustCite: ["interview_panels.panel_member_ids", "panel-size", "required-roles"],
      sourceSystemIds: ["greenhouse"],
    },
    {
      claim: "All scheduled slots are conflict-free across time zones",
      mustCite: ["scheduled_interviews.slot_start", "scheduled_interviews.slot_end", "timezone-buffer"],
      sourceSystemIds: ["google_calendar"],
    },
    {
      claim: "Candidate confirmation has been sent with prep materials",
      mustCite: ["scheduled_interviews.status", "scheduled_interviews.zoom_link", "candidate-prep"],
      sourceSystemIds: ["google_calendar", "greenhouse"],
    },
  ],
  escalationRules: [
    {
      trigger: "No available slot found within 5-day window for all panelists and candidate",
      action: "escalate_to_human",
      handoffTarget: "Recruiting Coordinator",
      rationale: "Tight scheduling windows or high interviewer load require human judgment to extend window or defer interview.",
    },
    {
      trigger: "Interviewer has 'do_not_schedule' flag set in Workday",
      action: "refuse",
      rationale: "Agent must respect Workday org flags; do not attempt to schedule flagged interviewers.",
    },
    {
      trigger: "Required panelist is missing from interview_panels query result",
      action: "request_more_info",
      rationale: "Panel composition is incomplete; agent must ask hiring manager or recruiter to confirm panel.",
    },
    {
      trigger: "Candidate has declined the interview more than once or marked 'unavailable' in Greenhouse",
      action: "escalate_to_human",
      handoffTarget: "Recruiting Coordinator",
      rationale: "Repeated candidate refusal requires manual intervention and possible interview rescheduling or candidate re-evaluation.",
    },
  ],
  refusalRules: [
    "Never invent or assume a Zoom link — always fetch or generate from Google Meet API, never mock.",
    "Never schedule outside business hours (8 AM – 6 PM local time) without an explicit business case override from the hiring manager.",
    "Never reschedule an interview more than once without recruiting coordinator approval.",
    "Never override a hiring manager's calendar hold or 'on travel' flag without explicit written consent.",
    "Never schedule an interview slot that violates the timezone-buffer SOP or places lunch in the middle of an interview.",
  ],
  goldenEvals: [
    {
      id: "happy-path-full-panel-scheduling",
      prompt: "Schedule a final-round interview for candidate C-12345 at requisition REQ-789. The panel is: Sarah (Engineering Lead, US-East), Miguel (Hiring Manager, US-West), and the candidate is in Europe (CET). Find a slot in the next 3 days, send confirmations with prep materials, and log to Greenhouse.",
      expectedToolCalls: [
        "query_greenhouse_candidates",
        "query_greenhouse_interview_panels",
        "query_workday_interviewers",
        "query_google_calendar_availability",
        "action_google_calendar_create_event",
        "action_greenhouse_log_scheduled_interview",
        "evidence_interview_panel_policy",
        "evidence_scheduling_etiquette_sop",
      ],
      mustReferenceEntities: ["candidates", "interview_panels", "interviewers", "scheduled_interviews"],
      mustCiteDocuments: ["interview-panel-composition-policy", "scheduling-etiquette-sop"],
      expectedActionOutcome: "Calendar events created for all panelists with Zoom link and prep materials, confirmations sent, and Greenhouse interview record updated with event ID and status.",
      forbiddenBehaviors: [
        "do not invent a Zoom link",
        "do not ignore timezone-buffer SOP",
        "do not schedule interviewer with do_not_schedule flag",
      ],
    },
    {
      id: "timezone-spanning-panel-conflict-resolution",
      prompt: "Schedule interviews for candidate C-67890 with a 3-person panel spanning US-West (8 AM–5 PM PT), EMEA (CET), and APAC (9 AM–6 PM SGT). One panelist is on travel next 2 days. Find a valid slot or escalate.",
      expectedToolCalls: [
        "query_greenhouse_candidates",
        "query_greenhouse_interview_panels",
        "query_workday_interviewers",
        "query_google_calendar_availability",
        "evidence_scheduling_etiquette_sop",
      ],
      mustReferenceEntities: ["candidates", "interview_panels", "interviewers"],
      mustCiteDocuments: ["scheduling-etiquette-sop"],
      expectedActionOutcome: "Either a slot that respects all time zones with buffer, or escalation to recruiting coordinator explaining the constraint conflict.",
      forbiddenBehaviors: [
        "do not violate timezone-buffer",
        "do not schedule during travel block",
      ],
    },
    {
      id: "interviewer-conflict-refusal",
      prompt: "Schedule an interview with interviewer INT-001, who has a 'do_not_schedule' flag in Workday. What does the agent do?",
      expectedToolCalls: [
        "query_greenhouse_candidates",
        "query_greenhouse_interview_panels",
        "query_workday_interviewers",
      ],
      mustReferenceEntities: ["interviewers"],
      expectedActionOutcome: "Agent refuses to schedule and escalates to recruiting coordinator, citing the Workday do_not_schedule flag.",
      forbiddenBehaviors: [
        "do not attempt to schedule the flagged interviewer",
        "do not remove them from the panel unilaterally",
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
    rationale: "Interview scheduling needs enough candidates, panels, interviewers, and calendar events to demonstrate multi-timezone conflict handling, availability scanning, and rescheduling without becoming large-data demo.",
  },
  sourceSystems: [
    {
      id: "greenhouse",
      name: "Greenhouse",
      owns: ["candidates", "interview_panels", "scheduled_interviews", "requisitions"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_greenhouse_candidates", "query_greenhouse_interview_panels", "action_greenhouse_log_scheduled_interview"],
      mcpToolNames: ["greenhouse_get_candidate", "greenhouse_list_interview_panels", "greenhouse_log_interview"],
      evidence: ["source_system_record", "generated_audit_trail", "api_response"],
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      owns: ["calendar_events", "invites", "availability_slots", "zoom_conference_links"],
      protocol: "Workspace API",
      localBacking: ["json-api", "firestore"],
      toolNames: ["query_google_calendar_availability", "action_google_calendar_create_event"],
      mcpToolNames: ["google_calendar_find_free_slots", "google_calendar_create_event"],
      evidence: ["source_system_record", "api_response", "generated_audit_trail"],
    },
    {
      id: "workday",
      name: "Workday",
      owns: ["interviewers", "office_locations", "travel_holds", "org_structure"],
      protocol: "REST API",
      localBacking: ["json-api", "alloydb"],
      toolNames: ["query_workday_interviewers"],
      mcpToolNames: ["workday_get_employee_profile"],
      evidence: ["source_system_record"],
    },
  ],
  entities: [
    {
      name: "candidates",
      sourceSystemId: "greenhouse",
      datastore: "alloydb",
      rowCount: 40,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "source_record_id", type: "seq", required: true },
        { name: "name", type: "person.fullName", required: true },
        { name: "email", type: "internet.email", required: true },
        { name: "stage", type: "enum", values: ["phone_screen", "technical_interview", "onsite_panel", "final_round", "offer"], required: true },
        { name: "requisition_id", type: "seq", required: true },
        { name: "time_zone", type: "enum", values: ["US-East", "US-Central", "US-West", "EMEA", "APAC"], required: true },
      ],
    },
    {
      name: "interview_panels",
      sourceSystemId: "greenhouse",
      datastore: "alloydb",
      rowCount: 50,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "requisition_id", type: "seq", required: true },
        { name: "interview_stage", type: "enum", values: ["phone_screen", "technical_interview", "onsite_panel", "final_round"], required: true },
        { name: "panel_member_ids", type: "string", required: true },
        { name: "created_at", type: "date.pastDate", required: true },
      ],
    },
    {
      name: "interviewers",
      sourceSystemId: "workday",
      datastore: "alloydb",
      rowCount: 60,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "source_record_id", type: "seq", required: true },
        { name: "name", type: "person.fullName", required: true },
        { name: "email", type: "internet.email", required: true },
        { name: "role", type: "enum", values: ["Hiring Manager", "Engineering Lead", "Team Member", "Recruiter", "HR Partner"], required: true },
        { name: "region", type: "enum", values: ["US-East", "US-Central", "US-West", "EMEA", "APAC"], required: true },
        { name: "time_zone", type: "enum", values: ["ET", "CT", "PT", "CET", "SGT", "IST"], required: true },
        { name: "do_not_schedule", type: "boolean", weights: [0.95, 0.05], required: true },
      ],
    },
    {
      name: "scheduled_interviews",
      sourceSystemId: "greenhouse",
      datastore: "alloydb",
      rowCount: 50,
      primaryKey: "id",
      columns: [
        { name: "id", type: "seq", required: true },
        { name: "candidate_id", type: "ref", ref: "candidates.id", required: true },
        { name: "panel_id", type: "ref", ref: "interview_panels.id", required: true },
        { name: "slot_start", type: "date.futureDate", required: true },
        { name: "slot_end", type: "date.futureDate", required: true },
        { name: "zoom_link", type: "internet.url", required: true },
        { name: "status", type: "enum", values: ["scheduled", "confirmed", "rescheduled", "completed", "cancelled"], required: true },
      ],
    },
  ],
  relationships: [
    { from: "scheduled_interviews.candidate_id", to: "candidates.id", cardinality: "many-to-one", orphanPolicy: "none" },
    { from: "scheduled_interviews.panel_id", to: "interview_panels.id", cardinality: "many-to-one", orphanPolicy: "none" },
  ],
  documents: [
    {
      id: "interview-panel-composition-policy",
      sourceSystemId: "greenhouse",
      type: "policy",
      title: "Interview Panel Composition Policy",
      requiredSections: ["Panel Size Requirements", "Required Roles", "Conflict of Interest Rules", "Panel Balance Guidelines"],
      linkedEntities: ["interview_panels", "interviewers"],
      minimumWordCount: 500,
      citationAnchors: ["panel-size", "required-roles", "coi-rules"],
    },
    {
      id: "scheduling-etiquette-sop",
      sourceSystemId: "greenhouse",
      type: "sop",
      title: "Scheduling Etiquette SOP",
      requiredSections: ["Time Zone Buffer Rules", "Business Hours", "Lunch Holds", "Reschedule Windows", "Candidate Prep Materials"],
      linkedEntities: ["scheduled_interviews", "candidates"],
      minimumWordCount: 400,
      citationAnchors: ["timezone-buffer", "lunch-hold", "reschedule-window", "candidate-prep"],
    },
  ],
  apis: [
    {
      systemId: "google_calendar",
      operation: "create_event",
      method: "POST",
      path: "/systems/google-calendar/events",
      requestSchema: { title: "string", attendees: "array", start_time: "string", end_time: "string", zoom_link: "string" },
      responseSchema: { event_id: "string", zoom_link: "string", calendar_invite_id: "string" },
      fixture: "mock_data/apis/fixtures/google_calendar_create_event.json",
      mcpToolName: "google_calendar_create_event",
    },
    {
      systemId: "greenhouse",
      operation: "log_scheduled_interview",
      method: "PATCH",
      path: "/systems/greenhouse/interviews/{id}",
      requestSchema: { candidate_id: "string", interview_stage: "string", event_id: "string", zoom_link: "string" },
      responseSchema: { interview_id: "string", status: "string", event_id: "string", zoom_link: "string" },
      fixture: "mock_data/apis/fixtures/greenhouse_log_scheduled_interview.json",
      mcpToolName: "greenhouse_log_interview",
    },
  ],
  anomalies: [
    {
      id: "candidate-timezone-mismatch",
      description: "Candidate in one time zone is scheduled with panel spanning multiple time zones, risking scheduling conflict or off-hours interview for candidate.",
      affectedEntities: ["candidates", "interviewers", "scheduled_interviews"],
      discoveryPath: ["Find candidates with APAC or EMEA time zones", "Join interview_panels with panel_member_ids", "Map interviewer time zones from Workday", "Detect slot_start/slot_end that violates timezone-buffer SOP"],
      expectedEvidence: ["Candidate time zone from source record", "Panel member time zones from Workday", "Scheduled slot times", "SOP citation for buffer"],
      expectedRecommendation: "Reschedule to a slot that respects business hours for all participants or escalate with rationale.",
    },
    {
      id: "back-to-back-interviewer-overload",
      description: "Single interviewer scheduled for multiple back-to-back interviews in a day without buffer, risking fatigue and poor interview quality.",
      affectedEntities: ["interviewers", "scheduled_interviews"],
      discoveryPath: ["Aggregate scheduled_interviews by interviewer_id", "Find same-day slots with <15 min gap", "Cross-check against interview_panels to identify overload"],
      expectedEvidence: ["Multiple scheduled_interview rows for same interviewer", "Slot times showing <15 min gap", "SOP timezone-buffer citation"],
      expectedRecommendation: "Notify recruiting coordinator to redistribute panelists or extend scheduling window.",
    },
  ],
  datastorePackaging: {
    alloydb: { database: "hr_recruiting", schemas: ["greenhouse", "workday"] },
    firestore: { database: "hr-recruiting-calendar", collections: ["calendar_events", "invites"] },
    bigquery: { dataset: "hr_recruiting_analytics", tables: ["scheduling_time", "reschedule_rate", "candidate_experience"] },
    cloudStorage: { bucketSuffix: "hr-recruiting-evidence", prefixes: ["documents/interview-policy", "zoom-links", "prep-materials"] },
    apis: { serviceName: "hr-recruiting-source-adapters", deploymentTarget: "cloud_run" },
  },
  behaviorContract,
  validation: {
    smokePrompt: "Schedule a 3-person final-round interview for candidate C-12345 (US-West) with panel: Sarah (US-East), Miguel (EMEA). Find a slot in next 2 days, send confirmations with prep materials, and log to Greenhouse.",
    expectedAnswer: ["queries Greenhouse for candidate and panel", "queries Workday for interviewer time zones", "scans Google Calendar for availability", "creates calendar event with Zoom link", "sends confirmations", "logs to Greenhouse", "cites scheduling SOP for timezone buffer"],
    assertions: ["all tool names are canonical", "all foreign keys resolve", "at least one document citation is used", "Zoom link is fetched/generated, never invented"],
  },
};

export const InterviewScheduling = () => (
  <UseCaseSlide
    title="Interview Scheduling & Coordination"
    subtitle="A-207 • Talent Acquisition"
    icon={Calendar}
    domainId="domain-2"
    layer="Layer 2: Agent Designer"
    persona="Recruiting Coordinator"
    systems={["Google Calendar", "ATS", "Slack", "Zoom"]}
    kpis={[
      { label: "Scheduling time", before: "45 min", after: "2 min" },
      { label: "Reschedule rate", before: "30%", after: "8%" },
      { label: "Candidate experience", before: "3.2/5", after: "4.7/5" }
    ]}
    triggerType="event"
    swimlane={swimlane}
    architecture={architecture}
    generationSpec={generationSpec}
    statusQuo={[
      "Recruiters spend 4-6 hours/week on calendar coordination.",
      "8-12 emails per candidate for multi-panel scheduling.",
      "Rescheduling restarts the cycle; high candidate drop-off."
    ]}
    agentification={[
      "Autonomous multi-panel scheduling via Calendar API.",
      "Self-healing loops for interviewer conflicts and no-shows.",
      "Automated candidate prep and scorecard collection."
    ]}
    flow={[
      { label: "Panel Identified", icon: Users, description: "Required interviewers and format determined.", trigger: "Shortlist Ready", systems: ["ATS"] },
      { label: "Calendar Scan", icon: Clock, description: "Availability across panelists and candidate checked.", systems: ["Gemini", "Calendar"], integration: "Agent Designer" },
      { label: "Auto-Schedule", icon: Calendar, description: "Optimal slots booked with buffer time and room/Zoom." },
      { label: "Confirmed", icon: CheckCircle, description: "Invites sent with prep materials attached.", output: "Scheduled" }
    ] as FlowStep[]}
  />
);
