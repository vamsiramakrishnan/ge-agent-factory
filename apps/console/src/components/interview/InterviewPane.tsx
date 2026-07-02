import { MessageSquareText, Play } from "lucide-react";
import { Button, CONTROL_CLASS, Field, cx } from "@ge/ui";
import { RuntimeInteractionForm, answersToRuntimeResponses } from "../RuntimeInteractionForm";
import type { GeEvent, RuntimeInteractionForm as RuntimeInteractionFormSchema, RuntimeTaskSummary } from "../../services/geClient";
import { ge } from "../../services/geClient";
import { DocumentDropzone } from "./DocumentDropzone";
import { DocumentPreview, combinedGroundingText, type GroundedDocument } from "./DocumentPreview";
import { InterviewTranscript } from "./InterviewTranscript";
import { SystemsField } from "./SystemsField";

type InteractionAnswers = Record<string, string | string[]>;
interface Interaction { id: string; form: RuntimeInteractionFormSchema; answered?: boolean; submittedAnswers?: InteractionAnswers }

const TEXTAREA_CLASS = cx(CONTROL_CLASS, "resize-y leading-6 disabled:opacity-60");

/**
 * The interview's LEFT pane: input brief + grounding-document workbench + the live
 * agent transcript and the agent-emitted interaction forms. All input flows through
 * the existing RuntimeInteractionForm + ge.runtimeInteraction round-trip — there is
 * no free-text chat box (locked decision).
 */
export function InterviewPane({
  usecaseId,
  outcome,
  systems,
  constraints,
  onOutcomeChange,
  onSystemsChange,
  onConstraintsChange,
  documents,
  onDocumentsChange,
  onStart,
  busy,
  runtimeProblem,
  task,
  events,
  interactions,
  onInteractionsChange,
}: {
  usecaseId: string;
  outcome: string;
  systems: string;
  constraints: string;
  onOutcomeChange: (value: string) => void;
  onSystemsChange: (value: string) => void;
  onConstraintsChange: (value: string) => void;
  documents: GroundedDocument[];
  onDocumentsChange: (next: GroundedDocument[]) => void;
  onStart: () => void;
  busy: boolean;
  runtimeProblem: boolean;
  task: RuntimeTaskSummary | null;
  events: GeEvent[];
  interactions: Interaction[];
  onInteractionsChange: (updater: (prev: Interaction[]) => Interaction[]) => void;
}) {
  const groundingChars = combinedGroundingText(documents).length;
  const answeredCount = interactions.filter((interaction) => interaction.answered).length;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-outline-variant/40 px-5 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-secondary">Conversation</div>
          <span className="rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px] font-medium text-primary">Antigravity</span>
        </div>
        <h2 className="mt-0.5 text-sm font-semibold text-on-surface">Interview</h2>
        <div className="mt-0.5 truncate font-mono text-[11px] text-secondary" title={usecaseId}>{usecaseId}</div>
      </div>

      <div className="space-y-6 px-5 py-4">
        <section>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-secondary">Input brief</h3>
          <div className="space-y-3">
            <Field label="Business outcome">
              <textarea
                value={outcome}
                onChange={(event) => onOutcomeChange(event.target.value)}
                rows={4}
                disabled={!!task}
                className={TEXTAREA_CLASS}
              />
            </Field>
            <div>
              <span className="mb-1 block text-xs font-medium text-secondary">Systems</span>
              <SystemsField value={systems} onChange={onSystemsChange} disabled={!!task} />
            </div>
            <Field label="Guardrails">
              <textarea
                value={constraints}
                onChange={(event) => onConstraintsChange(event.target.value)}
                rows={3}
                disabled={!!task}
                className={TEXTAREA_CLASS}
              />
            </Field>
          </div>
        </section>

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-secondary">Grounding documents</h3>
            {groundingChars > 0 && <span className="text-[11px] text-secondary">{groundingChars.toLocaleString()} chars</span>}
          </div>
          <DocumentDropzone usecaseId={usecaseId} onUploaded={(doc) => onDocumentsChange(mergeUploaded(documents, doc))} />
          <div className="mt-3">
            <DocumentPreview usecaseId={usecaseId} documents={documents} onChange={onDocumentsChange} />
          </div>
        </section>

        {!task && (
          <Button
            onClick={onStart}
            loading={busy}
            disabled={!outcome.trim() || runtimeProblem}
            className="w-full py-2.5"
          >
            {!busy && <Play className="h-4 w-4" aria-hidden />}
            {busy ? "Starting" : "Start Interview"}
          </Button>
        )}

        {interactions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-secondary">
                <MessageSquareText className="h-4 w-4" aria-hidden />
                Questions for you
              </h3>
              <span className="rounded-full bg-surface-container px-2 py-0.5 text-[10px] font-medium text-secondary">
                {answeredCount}/{interactions.length} answered
              </span>
            </div>
            {interactions.map((interaction) => (
              <RuntimeInteractionForm
                key={interaction.id}
                form={interaction.form}
                submittedAnswers={interaction.submittedAnswers}
                disabled={interaction.answered || !task?.id}
                onSubmit={async (answers) => {
                  if (!task?.id) return;
                  const responses = answersToRuntimeResponses(interaction.form, answers);
                  await ge.runtimeInteraction(task.id, interaction.id, { responses });
                  onInteractionsChange((prev) =>
                    prev.map((item) => (item.id === interaction.id ? { ...item, answered: true, submittedAnswers: answers } : item)),
                  );
                }}
              />
            ))}
          </section>
        )}

        {task && <InterviewTranscript events={events} />}
      </div>
    </div>
  );
}

function mergeUploaded(documents: GroundedDocument[], uploaded: { uri: string } & Record<string, any>): GroundedDocument[] {
  const next = documents.filter((doc) => doc.uri !== uploaded.uri);
  return [...next, { ...(uploaded as any), useForGrounding: true }];
}
