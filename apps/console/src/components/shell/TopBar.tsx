import { useState, useEffect, useRef } from "react";
import type { User } from "firebase/auth";
import { CircleHelp, ExternalLink } from "lucide-react";
import { Button } from "@ge/ui";
import { ModeToggle } from "../ModeToggle";
import { RuntimeStatusBadge } from "../RuntimeStatusBadge";
import { NowPulse } from "../NowPulse";
import type { StatusBoard } from "../../services/geClient";
import { authEnabled, subscribe, signOut } from "../../auth/firebase";

// Signed-in identity chip — only present when Firebase auth is enabled and a user
// is signed in. Inert (renders nothing) in the default IAP-fronted deployment.
function AuthChip() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!authEnabled) return;
    return subscribe(setUser);
  }, []);
  if (!authEnabled || !user) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-secondary">
      {user.email && <span className="truncate max-w-[180px]">{user.email}</span>}
      <button
        onClick={() => { void signOut(); }}
        className="px-2 py-1 border border-outline-variant/40 rounded-md hover:bg-surface-container-low transition-colors"
        title="Sign out"
      >
        Sign out
      </button>
    </div>
  );
}

// Quiet help affordance for terminal-native operators: keyboard shortcuts and
// the two docs entry points (glossary for jargon, cookbooks for walkthroughs).
// Plain useState popover — closes on outside click or Esc.
function HelpMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Help"
        aria-expanded={open}
        aria-haspopup="true"
        title="Help"
        onClick={() => setOpen((prev) => !prev)}
      >
        <CircleHelp className="w-4 h-4" />
      </Button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-outline-variant/40 bg-surface p-3 shadow-ambient">
          <div className="mb-1 text-4xs font-semibold uppercase tracking-wide text-secondary">Keyboard</div>
          <div className="space-y-1.5 text-xs text-on-surface">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded border border-outline-variant/40 bg-surface-container-low px-1.5 py-0.5 font-mono text-3xs">⌘K</span>
              <span className="text-secondary">command palette</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="rounded border border-outline-variant/40 bg-surface-container-low px-1.5 py-0.5 font-mono text-3xs">Esc</span>
              <span className="text-secondary">close panels</span>
            </div>
          </div>
          <div className="mb-1 mt-3 text-4xs font-semibold uppercase tracking-wide text-secondary">Docs</div>
          <div className="space-y-0.5">
            <a
              href="https://github.com/vamsiramakrishnan/ge-agent-factory/blob/main/docs/GLOSSARY.md"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded px-1 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Glossary <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
            <a
              href="https://github.com/vamsiramakrishnan/ge-agent-factory/tree/main/docs/cookbooks"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded px-1 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Cookbooks <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

interface TopBarProps {
  status: StatusBoard | null;
  mode: "local" | "remote";
  onModeChange: (mode: "local" | "remote") => void;
  onOpenPalette: () => void;
}

export function TopBar({ status, mode, onModeChange, onOpenPalette }: TopBarProps) {
  return (
    <header className="h-14 bg-surface border-b border-outline-variant/60 flex items-center justify-between px-6">
      <div className="flex items-center gap-2.5">
        <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
        <h1 className="font-headline text-sm font-semibold tracking-tight text-on-surface">
          GE Agent Factory
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {status && (
          <div className="text-xs text-secondary">
            {status.project && <span className="font-medium">{status.project}</span>}
            {status.project && status.app && <span className="mx-1.5">·</span>}
            {status.app && <span>{status.app}</span>}
          </div>
        )}

        <NowPulse />

        <RuntimeStatusBadge />

        <ModeToggle mode={mode} onChange={onModeChange} />

        <button
          onClick={onOpenPalette}
          className="px-2.5 py-1 text-xs font-mono text-secondary border border-outline-variant/40 rounded-md hover:bg-surface-container-low transition-colors"
          title="Command Palette (⌘K)"
        >
          ⌘K
        </button>

        <HelpMenu />

        <AuthChip />
      </div>
    </header>
  );
}
