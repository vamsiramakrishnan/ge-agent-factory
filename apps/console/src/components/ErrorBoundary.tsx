import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
  /** Label for the region that failed (e.g. the view name) — shown to the operator. */
  label?: string;
  /** Reset key: when it changes, the boundary clears its error (e.g. the active route). */
  resetKey?: string;
}

interface State {
  error: Error | null;
}

/**
 * Catches render-time throws so one bad view never white-screens the whole
 * console mid-operation (the toolbar, job toasts, and navigation keep working).
 * Class component because React error boundaries have no hook equivalent.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: Props) {
    // Clear the error when the operator navigates elsewhere.
    if (this.state.error && prev.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep a breadcrumb in the console for debugging; never swallow silently.
    console.error(`[console] render error in ${this.props.label || "view"}:`, error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-rose-400/30 bg-rose-500/[0.04] p-6 text-center">
          <AlertTriangle className="mx-auto h-8 w-8 text-rose-500" />
          <h2 className="mt-3 text-base font-semibold text-on-surface">
            {this.props.label ? `The ${this.props.label} view hit an error` : "Something went wrong"}
          </h2>
          <p className="mt-1 text-sm text-secondary">
            The rest of the console is still working — your running jobs are unaffected.
          </p>
          <pre className="mt-3 max-h-32 overflow-auto rounded-md bg-on-surface/[0.03] px-3 py-2 text-left text-[11px] font-mono text-rose-700/80 whitespace-pre-wrap">
            {error.message}
          </pre>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/15"
            >
              <RotateCw className="h-4 w-4" /> Retry
            </button>
            <a
              href="#/overview"
              onClick={() => this.setState({ error: null })}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-secondary hover:bg-surface-container-low hover:text-on-surface"
            >
              <Home className="h-4 w-4" /> Back to Overview
            </a>
          </div>
        </div>
      </div>
    );
  }
}
