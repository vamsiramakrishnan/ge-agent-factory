import { useState, useEffect } from "react";
import type { User } from "firebase/auth";
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

interface TopBarProps {
  status: StatusBoard | null;
  mode: "local" | "remote";
  onModeChange: (mode: "local" | "remote") => void;
  onOpenPalette: () => void;
}

export function TopBar({ status, mode, onModeChange, onOpenPalette }: TopBarProps) {
  return (
    <header className="h-14 bg-surface border-b border-outline-variant/30 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-on-surface">
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

        <AuthChip />
      </div>
    </header>
  );
}
