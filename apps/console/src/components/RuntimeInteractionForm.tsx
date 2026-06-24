import { useEffect, useMemo, useState } from "react";
import type { RuntimeInteractionForm as RuntimeInteractionFormSchema } from "../services/geClient";

type Answers = Record<string, string | string[]>;

export function RuntimeInteractionForm({
  form,
  disabled = false,
  submittedAnswers,
  onSubmit,
}: {
  key?: string;
  form: RuntimeInteractionFormSchema;
  disabled?: boolean;
  submittedAnswers?: Answers;
  onSubmit: (answers: Answers) => Promise<void> | void;
}) {
  const initial = useMemo(() => submittedAnswers || initialAnswers(form), [form, submittedAnswers]);
  const [answers, setAnswers] = useState<Answers>(initial);
  useEffect(() => {
    setAnswers(initial);
  }, [initial]);
  const [submitting, setSubmitting] = useState(false);
  const ready = form.questions.every((question) => {
    if (!question.required) return true;
    const value = answers[question.id];
    return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
  });

  const update = (id: string, value: string | string[]) => {
    if (disabled) return;
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggle = (id: string, optionId: string, maxSelections?: number) => {
    if (disabled) return;
    setAnswers((prev) => {
      const current = Array.isArray(prev[id]) ? prev[id] as string[] : [];
      const selected = current.includes(optionId);
      if (!selected && maxSelections && current.length >= maxSelections) return prev;
      return { ...prev, [id]: selected ? current.filter((item) => item !== optionId) : [...current, optionId] };
    });
  };

  return (
    <div className={`rounded-lg border p-4 ${disabled ? "border-outline-variant/40 bg-surface-container/40" : "border-primary/25 bg-primary/5"}`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
        <div className="text-sm font-semibold text-on-surface">{form.title || "Input needed"}</div>
        {form.description && <p className="mt-1 text-xs text-secondary">{form.description}</p>}
        </div>
        {disabled && <span className="rounded-full bg-surface-container px-2 py-1 text-[11px] font-medium text-secondary">answered</span>}
      </div>
      <div className="space-y-4">
        {form.questions.map((question) => {
          const value = answers[question.id];
          const options = question.options || [];
          return (
            <div key={question.id}>
              <label className="mb-1 block text-xs font-medium text-secondary">
                {question.label}{question.required ? " *" : ""}
              </label>
              {question.help && <div className="mb-2 text-[11px] text-secondary">{question.help}</div>}
              {question.type === "radio" && (
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <label key={option.id} className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs ${value === option.id ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/50 text-secondary hover:bg-surface-container"} ${disabled ? "cursor-default opacity-75" : ""}`}>
                      <input className="sr-only" type="radio" checked={value === option.id} disabled={disabled} onChange={() => update(question.id, option.id)} />
                      {option.label}
                    </label>
                  ))}
                </div>
              )}
              {question.type === "checkbox" && (
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => {
                    const list = Array.isArray(value) ? value : [];
                    const selected = list.includes(option.id);
                    const maxed = !selected && question.maxSelections && list.length >= question.maxSelections;
                    return (
                      <label key={option.id} className={`cursor-pointer rounded-md border px-3 py-1.5 text-xs ${selected ? "border-primary bg-primary/10 text-primary" : "border-outline-variant/50 text-secondary hover:bg-surface-container"} ${maxed || disabled ? "opacity-50" : ""}`}>
                        <input className="sr-only" type="checkbox" checked={selected} disabled={disabled || !!maxed} onChange={() => toggle(question.id, option.id, question.maxSelections)} />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              )}
              {question.type === "select" && (
                <select
                  className="w-full rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm text-on-surface"
                  value={typeof value === "string" ? value : ""}
                  disabled={disabled}
                  onChange={(event) => update(question.id, event.target.value)}
                >
                  <option value="">Choose...</option>
                  {options.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
                </select>
              )}
              {question.type === "text" && (
                <input
                  className="w-full rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm text-on-surface"
                  value={typeof value === "string" ? value : ""}
                  placeholder={question.placeholder}
                  disabled={disabled}
                  onChange={(event) => update(question.id, event.target.value)}
                />
              )}
              {question.type === "textarea" && (
                <textarea
                  className="w-full rounded-md border border-outline-variant/60 bg-surface-container px-3 py-2 text-sm text-on-surface"
                  rows={3}
                  value={typeof value === "string" ? value : ""}
                  placeholder={question.placeholder}
                  disabled={disabled}
                  onChange={(event) => update(question.id, event.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex justify-end">
        {disabled ? (
          <span className="mr-auto text-xs text-secondary">Answers sent. The agent can continue from this point.</span>
        ) : null}
        <button
          type="button"
          disabled={disabled || submitting || !ready}
          onClick={async () => {
            setSubmitting(true);
            try {
              await onSubmit(answers);
            } finally {
              setSubmitting(false);
            }
          }}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Submitting" : form.submitLabel || "Continue"}
        </button>
      </div>
    </div>
  );
}

function initialAnswers(form: RuntimeInteractionFormSchema): Answers {
  const out: Answers = {};
  for (const question of form.questions || []) {
    if (Array.isArray(question.defaultValue)) out[question.id] = question.defaultValue;
    else if (typeof question.defaultValue === "string") out[question.id] = question.defaultValue;
    else out[question.id] = question.type === "checkbox" ? [] : "";
  }
  return out;
}

export function answersToRuntimeResponses(form: RuntimeInteractionFormSchema, answers: Answers) {
  return (form.questions || []).map((question) => {
    const value = answers[question.id];
    if (Array.isArray(value)) return { questionId: question.id, selectedOptionIds: value };
    if (["radio", "select"].includes(question.type) && value) return { questionId: question.id, selectedOptionIds: [value] };
    return { questionId: question.id, freeformResponse: typeof value === "string" ? value : "", skipped: !value };
  });
}
