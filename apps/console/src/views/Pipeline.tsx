import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Boxes, Database, FileText, GitBranch, ListChecks, MessageSquareText, Play, RefreshCw, Search, User, Users } from "lucide-react";
import { Button, CONTROL_CLASS, Field, PageHeader, Segmented, Select, Stat } from "@ge/ui";
import { ge, startJob, type PipelinePlan, type PipelineStage, type RuntimeTaskSummary, type SpecCatalog, type SpecOption, type StatusBoard } from "../services/geClient";
import { Lifecycle } from "../components/Lifecycle";
import { CliEquivalent } from "../components/CliEquivalent";
import { ErrorBanner } from "../components/ErrorBanner";
import { actionCommand, isExecutableAction, planNavigates } from "../lib/actionPlans";
import { useToast } from "../lib/toast";
import { slugify, splitCsv, startInterview } from "../lib/startInterview";
import { SystemsField } from "../components/interview/SystemsField";
import { useRunFollow } from "../state/runFollow";
import { Stepper, type StepDef } from "../components/pipeline/Stepper";
import { BulkSpecPicker, SpecSearchResults, SpecSummary } from "../components/pipeline/SpecPicker";
import { ContractRow, SourceOption, TargetSelect } from "../components/pipeline/WizardControls";
import { InterviewContextPanel, NextActionPanel } from "../components/pipeline/InterviewPanels";

const WIZARD_STEPS: StepDef[] = [
  { id: 1, label: "Source" },
  { id: 2, label: "Configure" },
  { id: 3, label: "Review" },
];

interface PipelineProps {
  status: StatusBoard | null;
  refresh: () => Promise<void>;
}

const DEFAULT_SCENARIO = "benefits-enrollment";
const DEFAULT_SYSTEMS = "workday,sap_concur";
const DEFAULT_OUTCOME = "Help HR teams resolve benefits enrollment exceptions before payroll cutover.";
const DEFAULT_DEPARTMENT = "all";

function normalizeSystemIds(systems: string[] = []) {
  return systems
    .map((system) => system.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, ""))
    .filter(Boolean);
}

function readInterviewSeed() {
  try {
    return JSON.parse(window.localStorage.getItem("ge.interview.seed") || "{}");
  } catch {
    return {};
  }
}

function readGeneratedSpecIdentity(): { id?: string; path?: string } {
  try {
    return JSON.parse(window.localStorage.getItem("ge.interview.generatedSpec") || "{}");
  } catch {
    return {};
  }
}

function readPreferredSpecId() {
  return window.localStorage.getItem("ge.pipeline.selectedSpecId") || "";
}

export default function Pipeline({ status, refresh }: PipelineProps) {
  const initialSeed = useMemo(() => readInterviewSeed(), []);
  const initialGeneratedSpec = useMemo(() => readGeneratedSpecIdentity(), []);
  const initialPreferredSpecId = useMemo(() => readPreferredSpecId(), []);
  const [sourceMode, setSourceMode] = useState<"new" | "existing">(() => initialPreferredSpecId ? "existing" : initialGeneratedSpec.id || initialSeed.outcome ? "new" : "existing");
  const [scopeMode, setScopeMode] = useState<"single" | "bulk">("single");
  const [outcome, setOutcome] = useState(typeof initialSeed.outcome === "string" ? initialSeed.outcome : DEFAULT_OUTCOME);
  const [constraints, setConstraints] = useState(typeof initialSeed.constraints === "string" ? initialSeed.constraints : "Use existing simulator packs when available. Require evidence before any write action.");
  const [scenario, setScenario] = useState(DEFAULT_SCENARIO);
  const [systems, setSystems] = useState(typeof initialSeed.systems === "string" ? initialSeed.systems : DEFAULT_SYSTEMS);
  const [ids, setIds] = useState("");
  const [specCatalog, setSpecCatalog] = useState<SpecCatalog | null>(null);
  const [specSearch, setSpecSearch] = useState("");
  const [specDepartment, setSpecDepartment] = useState(DEFAULT_DEPARTMENT);
  const [selectedSpecId, setSelectedSpecId] = useState("");
  const [selectedSpecSnapshot, setSelectedSpecSnapshot] = useState<SpecOption | null>(null);
  const [selectedBulkIds, setSelectedBulkIds] = useState<string[]>([]);
  const [targetStage, setTargetStage] = useState("preview");
  const [concurrency, setConcurrency] = useState(() => window.localStorage.getItem("ge.pipeline.concurrency") || "8");
  const [plan, setPlan] = useState<PipelinePlan | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState(() => window.localStorage.getItem("ge.interview.activeTaskId") || "");
  const [activeInterviewTask, setActiveInterviewTask] = useState<RuntimeTaskSummary | null>(null);
  const [generatedSpecId, setGeneratedSpecId] = useState(initialGeneratedSpec.id || "");
  const [generatedSpecPath, setGeneratedSpecPath] = useState(initialGeneratedSpec.path || "");
  const [busy, setBusy] = useState<"load" | "run" | "interview" | null>("load");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [error, setError] = useState<string | null>(null);
  const notify = useToast();
  const { followRun } = useRunFollow();

  const systemList = useMemo(() => splitCsv(systems), [systems]);
  const requestedIds = useMemo(() => {
    if (sourceMode === "existing") {
      return scopeMode === "single"
        ? (selectedSpecId ? [selectedSpecId] : splitCsv(ids).slice(0, 1))
        : selectedBulkIds;
    }
    return splitCsv(ids);
  }, [ids, scopeMode, selectedBulkIds, selectedSpecId, sourceMode]);
  const idList = useMemo(() => scopeMode === "single" ? requestedIds.slice(0, 1) : requestedIds, [requestedIds, scopeMode]);
  const effectiveScenario = sourceMode === "new" ? slugify(outcome) : scenario.trim() || DEFAULT_SCENARIO;
  const reviewUsecaseId = sourceMode === "new"
    ? generatedSpecId || effectiveScenario
    : scopeMode === "single" && idList[0]
      ? idList[0]
      : effectiveScenario;
  const selectedSpec = useMemo(
    () => (specCatalog?.specs || []).find((spec) => spec.id === selectedSpecId) || (selectedSpecSnapshot?.id === selectedSpecId ? selectedSpecSnapshot : null),
    [selectedSpecId, selectedSpecSnapshot, specCatalog],
  );
  const isRemoteMode = status?.mode === "remote";
  const updateConcurrency = (value: string) => {
    setConcurrency(value);
    window.localStorage.setItem("ge.pipeline.concurrency", value);
  };
  const selectedBulkSpecs = useMemo(() => {
    const selected = new Set(selectedBulkIds);
    return (specCatalog?.specs || []).filter((spec) => selected.has(spec.id));
  }, [selectedBulkIds, specCatalog]);
  const pipelineSpecPath = sourceMode === "new"
    ? generatedSpecPath || (generatedSpecId ? `.ge/interviews/${generatedSpecId}/agent-spec.json` : "")
    : scopeMode === "single" && selectedSpec?.source === "interview" && selectedSpec.sourcePath
      ? selectedSpec.sourcePath
      : "";

  const applySpecDefaults = (spec: SpecOption | null) => {
    if (!spec) return;
    setScenario(spec.id);
    setSystems(normalizeSystemIds(spec.systems || []).join(",") || systems);
    setIds(spec.id);
  };

  const selectSpec = (spec: SpecOption | null) => {
    if (!spec) return;
    setSelectedSpecId(spec.id);
    setSelectedSpecSnapshot(spec);
    applySpecDefaults(spec);
  };

  const loadSpecs = async () => {
    try {
      const catalog = await ge.specs({
        q: specSearch,
        department: specDepartment === DEFAULT_DEPARTMENT ? undefined : specDepartment,
        limit: 250,
      });
      setSpecCatalog(catalog);
      const preferredId = window.localStorage.getItem("ge.pipeline.selectedSpecId") || "";
      const preferredSpec = preferredId ? catalog.specs.find((spec) => spec.id === preferredId) : null;
      const currentSpec = selectedSpecId ? catalog.specs.find((spec) => spec.id === selectedSpecId) : null;
      if (currentSpec) setSelectedSpecSnapshot(currentSpec);
      const defaultSpec = preferredSpec || (!selectedSpecId && !specSearch.trim() ? catalog.specs[0] : null);
      if (defaultSpec) {
        setSelectedSpecId(defaultSpec.id);
        setSelectedSpecSnapshot(defaultSpec);
        setScenario(defaultSpec.id);
        setIds(defaultSpec.id);
        if (preferredSpec) window.localStorage.removeItem("ge.pipeline.selectedSpecId");
        if (!systems.trim() || systems === DEFAULT_SYSTEMS) {
          setSystems(normalizeSystemIds(defaultSpec.systems || []).join(",") || DEFAULT_SYSTEMS);
        }
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load specs");
    }
  };

  const loadPipelinePlan = async () => {
    setBusy((current) => current || "load");
    try {
      const next = await ge.pipelinePlan({
        scenario: effectiveScenario,
        spec: pipelineSpecPath || undefined,
        usecaseId: reviewUsecaseId,
        systems: systemList,
        ids: idList,
        targetStage,
      });
      setPlan(next);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load the pipeline plan");
    } finally {
      setBusy(null);
    }
  };

  const refreshActiveInterview = async (taskId = activeInterviewId) => {
    if (!taskId) {
      setActiveInterviewTask(null);
      return;
    }
    try {
      setActiveInterviewTask(await ge.runtimeTask(taskId));
    } catch {
      setActiveInterviewTask(null);
    }
  };

  useEffect(() => {
    loadPipelinePlan();
  }, []);

  useEffect(() => {
    void refreshActiveInterview();
  }, [activeInterviewId]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      loadSpecs();
    }, 150);
    return () => window.clearTimeout(handle);
  }, [specSearch, specDepartment]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      loadPipelinePlan();
    }, 250);
    return () => window.clearTimeout(handle);
  }, [effectiveScenario, pipelineSpecPath, reviewUsecaseId, systems, idList.join(","), targetStage]);

  const startPipeline = async () => {
    setBusy("run");
    try {
      const task = await ge.pipelineRun({
        scenario: effectiveScenario,
        spec: pipelineSpecPath || undefined,
        systems: systemList,
        ids: idList,
        targetStage,
        attempts: 3,
        runPreview: true,
      });
      notify(`Started pipeline run ${task.id}`);
      followRun(task.id, { kind: task.kind || "pipeline.run", source: effectiveScenario });
      await Promise.all([loadPipelinePlan(), refresh()]);
    } catch (err: any) {
      setError(err.message || "Failed to start the pipeline run");
    } finally {
      setBusy(null);
    }
  };

  const handleStartInterview = async () => {
    setBusy("interview");
    try {
      const usecaseId = slugify(outcome);
      const task = await startInterview({ outcome, systems, constraints, usecaseId, status });
      notify(`Started guided interview ${task.id}`);
      setActiveInterviewId(task.id);
      setActiveInterviewTask(task);
      setGeneratedSpecId(usecaseId);
      setGeneratedSpecPath(`.ge/interviews/${usecaseId}/agent-spec.json`);
      await refresh();
      location.hash = "#/interview";
    } catch (err: any) {
      setError(err.detail || err.message || "Failed to start interview");
    } finally {
      setBusy(null);
    }
  };

  const runStageAction = async (stage: PipelineStage) => {
    const plan = stage.actionPlan;
    if (!plan) return;
    const command = actionCommand(plan);
    // reconcile-b: navigate only for navigate-mode kinds; execute kinds run below even if
    // they carry a route (no more "primary button sometimes navigates, sometimes runs").
    const nav = planNavigates(plan, stage.id);
    if (nav) {
      location.hash = nav;
      return;
    }
    if ((plan.kind === "resume_harness" || plan.kind === "resume_pipeline" || plan.kind === "resume_repair" || command.startsWith("ge runs resume") || command.startsWith("ge runtime resume")) && plan.taskId) {
      setBusy("run");
      try {
        await ge.runtimeResume(plan.taskId);
        notify(`Resumed ${plan.taskId}`);
        await Promise.all([loadPipelinePlan(), refresh()]);
        location.hash = stage.id === "interview" ? "#/interview" : "#/activity";
      } catch (err: any) {
        setError(err.detail || err.message || "Failed to resume task");
      } finally {
        setBusy(null);
      }
      return;
    }
    if (plan.kind === "run_pipeline" || plan.kind === "run_preview" || command.startsWith("ge pipeline run")) {
      await startPipeline();
      return;
    }
    if (plan.kind === "build_agents" || command.startsWith("ge agents build")) {
      const ids = plan.agentIds?.length ? plan.agentIds.join(",") : idList.join(",");
      if (!ids) {
        setError("Select at least one spec before building agents.");
        return;
      }
      await startJob("Build selected agents", ge.build({
        ids,
        local: isRemoteMode ? false : true,
        ...(isRemoteMode ? { concurrency } : {}),
      }));
      notify("Started agent build");
      await refresh();
      location.hash = "#/activity";
      return;
    }
    if (plan.kind === "handoff_agents" || command.startsWith("ge handoff")) {
      const ids = plan.workspaceIds?.length ? plan.workspaceIds.join(",") : idList.join(",");
      if (!ids) {
        setError("Select at least one spec before handing off agents.");
        return;
      }
      await startJob("Hand off selected agents", ge.handoff({ ids, concurrency }));
      notify("Started agent handoff");
      await refresh();
      location.hash = "#/activity";
      return;
    }
    if (plan.kind === "repair_agent") {
      const ids = plan.agentIds?.length ? plan.agentIds : idList;
      if (!ids.length) {
        setError("Select at least one agent to repair.");
        return;
      }
      setBusy("run");
      try {
        const started = await ge.startRepair({ ids, targetStage: "preview", repair: true, attempts: 3, runPreview: true });
        notify("Started repair");
        if (started.runId) followRun(started.runId, { kind: "repair.run", source: "repair" });
        await Promise.all([loadPipelinePlan(), refresh()]);
        if (!started.runId) location.hash = "#/activity";
      } catch (err: any) {
        setError(err.detail || err.message || "Failed to start repair");
      } finally {
        setBusy(null);
      }
      return;
    }
    if (plan.kind === "start_interview") {
      location.hash = "#/interview";
      return;
    }
    // No console executor is registered for this action kind — say so instead
    // of leaving a button that silently does nothing (ErrorBanner turns the
    // backtick-quoted command into a one-click copy).
    setError(command
      ? `The console can't run this action yet — run it from a terminal: \`${command}\``
      : `No console executor is registered for action kind: ${plan.kind}`);
  };

  const next = plan?.next;
  const selectedCount = sourceMode === "existing"
    ? (scopeMode === "single" ? (selectedSpecId ? 1 : 0) : selectedBulkIds.length)
    : 1;
  const targetLabel = targetStage === "preview" ? "Preview" : targetStage === "deploy" ? "Deploy" : "Publish";
  const launchDisabled = busy !== null || (sourceMode === "existing" && selectedCount === 0);
  const routeTitle = sourceMode === "new" ? "Interview to registered spec" : "Deploy from registered specs";
  const selectedSpecLabel = sourceMode === "new"
    ? slugify(outcome)
    : scopeMode === "single"
      ? selectedSpec?.title || "No spec selected"
      : selectedBulkSpecs.length
        ? selectedBulkSpecs.slice(0, 2).map((spec) => spec.title).join(", ") + (selectedBulkSpecs.length > 2 ? ` +${selectedBulkSpecs.length - 2}` : "")
        : "No specs selected";
  const primaryCtaLabel = sourceMode === "new" ? "Start interview" : `Run ${selectedCount} spec${selectedCount === 1 ? "" : "s"}`;
  const goReview = () => { setError(null); setStep(3); };
  const goConfigure = () => { setError(null); setStep(2); };
  const goSource = () => { setError(null); setStep(1); };

  return (
    <div className="mx-auto max-w-5xl px-6 py-7">
      <PageHeader
        size="lg"
        eyebrow="Spec to deploy"
        title="Pipeline"
        subtitle={
          <>
            The build &amp; deploy flow for a spec (or a batch): data, simulators, agent build, evals, repair, and deployment gates. For the roster of all existing agents, see the <a href="#/fleet" className="text-primary hover:underline">Fleet</a>.
          </>
        }
        meta={
          <>
            <Stat size="sm" label="Mode" value={status?.mode || plan?.mode || "local"} />
            <Stat size="sm" label="Specs" value={specCatalog ? String(specCatalog.total) : "…"} />
            <Stat size="sm" label="GCP Project" value={status?.project || "local"} />
          </>
        }
        actions={
          <>
            {activeInterviewId && (
              <Button
                variant="ghost"
                size="sm"
                className="border border-primary/30 bg-primary/5"
                onClick={() => { location.hash = "#/interview"; }}
              >
                <MessageSquareText className="h-4 w-4" />
                Continue Interview
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={loadPipelinePlan} disabled={busy !== null}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </>
        }
      />

      <section className="mb-6 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface shadow-ambient">
        <div className="flex items-center justify-center border-b border-outline-variant/30 px-6 py-4">
          <Stepper steps={WIZARD_STEPS} current={step} onStep={(id) => setStep(id as 1 | 2 | 3)} />
        </div>

        {error && <ErrorBanner tone="amber" message={error} onRetry={loadPipelinePlan} className="mx-6 mt-5" />}

        {/* Step 1 — Source */}
        {step === 1 && (
          <div className="px-6 py-6">
            <div className="mb-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                <GitBranch className="h-3.5 w-3.5" />
                Choose the route
              </div>
              <h2 className="mt-1 text-xl font-semibold text-on-surface">How do you want to start?</h2>
              <p className="mt-1 text-sm text-secondary">Begin with discovery, or move directly from a registered specification.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <SourceOption
                active={sourceMode === "existing"}
                Icon={FileText}
                title="Deploy from registered specs"
                detail={`${specCatalog ? `${specCatalog.total} factory-grade specs are` : "The registered spec catalog is"} available for single-agent or fleet runs.`}
                onClick={() => setSourceMode("existing")}
              />
              <SourceOption
                active={sourceMode === "new"}
                Icon={MessageSquareText}
                title="Interview to registered spec"
                detail="Use Antigravity to ask questions, generate a catalog-grade spec, and register it before deployment."
                onClick={() => setSourceMode("new")}
              />
            </div>
            <div className="mt-6 flex justify-end border-t border-outline-variant/30 pt-5">
              <Button variant="primary" size="md" onClick={goConfigure}>
                Next: Configure
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — Configure */}
        {step === 2 && (
          <div className="px-6 py-6">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Configure the work</div>
                <h2 className="mt-1 text-xl font-semibold text-on-surface">
                  {sourceMode === "new" ? "Define the interview seed" : scopeMode === "single" ? "Select one buildable spec" : "Select a fleet from the registry"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Scope</div>
                <Segmented<"single" | "bulk">
                  aria-label="Scope"
                  options={[
                    { value: "single", label: <><User className="h-3.5 w-3.5" /> Single</> },
                    { value: "bulk", label: <><Users className="h-3.5 w-3.5" /> Fleet</> },
                  ]}
                  value={scopeMode}
                  onChange={setScopeMode}
                />
              </div>
            </div>

            {sourceMode === "new" ? (
              <div className="grid gap-5">
                <Field label="Business outcome">
                  <textarea
                    value={outcome}
                    onChange={(event) => setOutcome(event.target.value)}
                    rows={5}
                    className={`${CONTROL_CLASS} resize-y leading-6`}
                  />
                </Field>
                <div className="grid gap-5 lg:grid-cols-2">
                  <Field label="Known systems">
                    <SystemsField value={systems} onChange={setSystems} />
                  </Field>
                  <Field label="Target">
                    <TargetSelect value={targetStage} onChange={setTargetStage} />
                  </Field>
                </div>
                <Field label="Guardrails">
                  <textarea
                    value={constraints}
                    onChange={(event) => setConstraints(event.target.value)}
                    rows={4}
                    className={`${CONTROL_CLASS} resize-y leading-6`}
                  />
                </Field>
              </div>
            ) : (
              <div className="grid gap-5">
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px]">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-secondary">Search specs</label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-secondary" />
                      <input
                        value={specSearch}
                        onChange={(event) => setSpecSearch(event.target.value)}
                        placeholder="Search by title, id, system, persona..."
                        className={`${CONTROL_CLASS} pl-9`}
                      />
                    </div>
                  </div>
                  <Field label="Department">
                    <Select
                      value={specDepartment}
                      onChange={(event) => setSpecDepartment(event.target.value)}
                    >
                      <option value={DEFAULT_DEPARTMENT}>All departments</option>
                      {(specCatalog?.departments || []).map((department) => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {scopeMode === "single" ? (
                  <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.7fr)]">
                    <SpecSearchResults
                      specs={specCatalog?.specs || []}
                      selectedId={selectedSpecId}
                      search={specSearch}
                      onSelect={selectSpec}
                    />
                    <SpecSummary spec={selectedSpec} />
                  </div>
                ) : (
                  <BulkSpecPicker
                    specs={specCatalog?.specs || []}
                    selectedIds={selectedBulkIds}
                    onToggle={(id) => {
                      setSelectedBulkIds((current) => {
                        const selected = new Set(current);
                        if (selected.has(id)) selected.delete(id);
                        else selected.add(id);
                        const nextIds = Array.from(selected);
                        setIds(nextIds.join(","));
                        if (!scenario.trim() && nextIds[0]) setScenario(nextIds[0]);
                        return nextIds;
                      });
                    }}
                    onClear={() => {
                      setSelectedBulkIds([]);
                      setIds("");
                    }}
                  />
                )}

                <div className="grid gap-5 lg:grid-cols-3">
                  <Field label="Systems">
                    <SystemsField value={systems} onChange={setSystems} />
                  </Field>
                  <Field label="Target">
                    <TargetSelect value={targetStage} onChange={setTargetStage} />
                  </Field>
                  <Field label="Parallelism">
                    <Select value={concurrency} onChange={(event) => updateConcurrency(event.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="8">8</option>
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-5">
              <Button variant="outline" size="md" onClick={goSource}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={goReview}
                disabled={sourceMode === "existing" && selectedCount === 0}
              >
                Next: Review
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {sourceMode === "existing" && selectedCount === 0 && (
              <p className="mt-2 text-right text-xs text-secondary">Select at least one spec to continue.</p>
            )}
          </div>
        )}

        {/* Step 3 — Review & launch */}
        {step === 3 && (
          <div className="px-6 py-6">
            <div className="mb-5">
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Run contract</div>
              <h2 className="mt-1 text-xl font-semibold text-on-surface">{sourceMode === "new" ? "Review & start interview" : "Review & run pipeline"}</h2>
              <p className="mt-1 text-sm text-secondary">Confirm the contract below, then launch.</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low/45 p-5">
                <div className="divide-y divide-outline-variant/30">
                  <ContractRow Icon={GitBranch} label="Source" value={routeTitle} />
                  <ContractRow Icon={ListChecks} label={sourceMode === "new" ? "Outcome" : "Selected specs"} value={selectedSpecLabel} />
                  <ContractRow Icon={Database} label="Systems" value={systemList.length ? systemList.join(", ") : "Not set"} />
                  <ContractRow Icon={Boxes} label="Target" value={`${targetLabel} ready`} />
                  <ContractRow Icon={Users} label="Scope" value={scopeMode === "single" ? "Single agent" : `Fleet · ${selectedCount} spec${selectedCount === 1 ? "" : "s"}`} />
                  <ContractRow Icon={GitBranch} label="Parallelism" value={`${concurrency} remote submission${concurrency === "1" ? "" : "s"}`} />
                  <ContractRow Icon={GitBranch} label="Runtime" value={`${status?.mode || "local"} · ${plan?.implementation?.pipelineGraph ? "typed run graph" : "pipeline planner"}`} />
                </div>
              </div>

              <aside className="grid content-start gap-2">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={sourceMode === "new" ? handleStartInterview : startPipeline}
                  disabled={launchDisabled}
                >
                  <Play className="h-4 w-4" />
                  {primaryCtaLabel}
                </Button>
                {/* Registry-derived CLI equivalent of this launch: interview
                    capture vs the resumable pipeline run. */}
                <CliEquivalent commandId={sourceMode === "new" ? "capture" : "pipeline.run"} />
                {sourceMode === "existing" && selectedCount === 0 && (
                  <p className="text-xs text-secondary">Select at least one spec before running.</p>
                )}
                {(sourceMode === "new" || activeInterviewId) && (
                  <InterviewContextPanel
                    task={activeInterviewTask}
                    activeInterviewId={activeInterviewId}
                    generatedSpecId={generatedSpecId}
                    generatedSpecPath={generatedSpecPath}
                    fallbackUsecaseId={sourceMode === "new" ? slugify(outcome) : ""}
                    onRefresh={() => refreshActiveInterview()}
                  />
                )}
                {next && <NextActionPanel next={next} />}
              </aside>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-outline-variant/30 pt-5">
              <Button variant="outline" size="md" onClick={goConfigure}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          </div>
        )}
      </section>

      {(plan?.stages?.length || 0) > 0 && (
        <section className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface">
          <div className="grid gap-3 border-b border-outline-variant/30 px-5 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Stage status</div>
              <h2 className="mt-1 text-lg font-semibold text-on-surface">What the pipeline will do next</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => { location.hash = "#/activity"; }}>
                Open Runs
              </Button>
              <Button variant="outline" size="sm" onClick={() => { location.hash = "#/fleet"; }}>
                Open Fleet
              </Button>
            </div>
          </div>
          <div className="p-6">
            <Lifecycle
              stages={plan?.stages || []}
              nextId={plan?.next?.id}
              onAction={(plan, stage) => runStageAction(stage)}
              orientation="vertical"
            />
          </div>
        </section>
      )}
    </div>
  );
}
