interface ModeToggleProps {
  mode: "local" | "remote";
  onChange: (mode: "local" | "remote") => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 bg-surface-container-low rounded-lg border border-outline-variant/40">
      <button
        onClick={() => onChange("local")}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          mode === "local"
            ? "bg-surface text-primary shadow-sm"
            : "text-secondary hover:text-on-surface"
        }`}
      >
        Local
      </button>
      <button
        onClick={() => onChange("remote")}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          mode === "remote"
            ? "bg-surface text-primary shadow-sm"
            : "text-secondary hover:text-on-surface"
        }`}
      >
        Remote
      </button>
    </div>
  );
}
