interface ModeToggleProps {
  mode: "local" | "remote";
  onChange: (mode: "local" | "remote") => void;
}

// A physical selector switch: recessed track, and the engaged position is a
// raised machined key with its indicator lamp lit — same grammar as
// @ge/ui's <Segmented>.
export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const option = (value: "local" | "remote", label: string) => {
    const active = mode === value;
    return (
      <button
        onClick={() => onChange(value)}
        aria-pressed={active}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          active ? "key bg-surface font-semibold text-on-surface" : "text-secondary hover:text-on-surface"
        }`}
      >
        {active && <span className="lamp h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />}
        {label}
      </button>
    );
  };
  return (
    <div className="well inline-flex items-center rounded-full bg-surface-container p-0.5">
      {option("local", "Local")}
      {option("remote", "Remote")}
    </div>
  );
}
