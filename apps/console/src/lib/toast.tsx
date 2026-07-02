import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

// One toast system for the whole console. Previously every view hand-rolled its
// own toast state + setTimeout + markup; this hoists it so feedback is positioned,
// styled, and dismissed identically everywhere. Use via: const toast = useToast().
export type ToastTone = "info" | "success" | "error";
interface Toast { id: string; message: string; tone: ToastTone }
export type ShowToast = (message: string, tone?: ToastTone) => void;

const ToastContext = createContext<ShowToast>(() => {});

export function useToast(): ShowToast {
  return useContext(ToastContext);
}

let toastSeq = 0;

const TONE: Record<ToastTone, { icon: any; cls: string }> = {
  info: { icon: Info, cls: "border-outline-variant/40 bg-surface text-on-surface" },
  success: { icon: CheckCircle2, cls: "border-status-passed/30 bg-status-passed/5 text-status-passed-ink" },
  error: { icon: AlertTriangle, cls: "border-status-failed/30 bg-status-failed/5 text-status-failed-ink" },
};

export function ToastProvider({ children }: { children?: any }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = useCallback<ShowToast>((message, tone = "info") => {
    const id = `t${++toastSeq}`;
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      {/* bottom-center, above the bottom-right JobToast column so they don't overlap */}
      <div className="pointer-events-none fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => {
          const { icon: Icon, cls } = TONE[t.tone];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-2.5 rounded-lg border px-3.5 py-2 text-sm shadow-ambient-lg ${cls}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="max-w-md">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                className="ml-1 rounded p-0.5 text-secondary hover:bg-surface-container hover:text-on-surface"
                aria-label="Dismiss"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
