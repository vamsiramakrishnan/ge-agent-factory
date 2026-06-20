import React, { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { Cpu, LogOut } from "lucide-react";

import { authEnabled, subscribe, signInWithGoogle, signOut } from "./firebase";

/**
 * Opt-in Google sign-in gate. When auth is disabled (the default) this renders
 * its children untouched — zero behavior change. When enabled it blocks the deck
 * behind a minimal centered sign-in screen until a user is present, then shows a
 * small signed-in indicator with sign-out.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  // Disabled: render children directly, no hooks, no Firebase, no gate.
  if (!authEnabled) return <>{children}</>;
  return <AuthGateActive>{children}</AuthGateActive>;
}

function AuthGateActive({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribe((u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="aurora-blob -z-10 top-[-10%] right-[-6%] w-[55%] h-[55%] opacity-[0.07]" style={{ backgroundColor: "#1a73e8" }} />
        <span className="text-xs font-mono text-secondary/60 tracking-widest uppercase">Loading…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className="fixed inset-0 overflow-hidden flex items-center justify-center p-6"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="aurora-blob -z-10 top-[-10%] right-[-6%] w-[55%] h-[55%] opacity-[0.07]" style={{ backgroundColor: "#1a73e8" }} />
        <div className="aurora-blob -z-10 bottom-[-12%] left-[-8%] w-[45%] h-[50%] opacity-[0.06]" style={{ backgroundColor: "#9aa6b8" }} />

        <div className="editorial-card rounded-2xl p-8 w-full max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center shadow-ambient mx-auto mb-5">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-headline font-bold text-lg tracking-tight">Gemini Enterprise</h1>
          <p className="text-sm text-secondary mt-1.5 mb-6">Sign in to continue to the presentation.</p>

          <button
            onClick={handleSignIn}
            disabled={busy}
            className="w-full h-11 rounded-lg bg-primary text-white font-headline font-semibold text-sm tracking-tight shadow-ambient hover:shadow-glow transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Signing in…" : "Sign in with Google"}
          </button>

          {error && <p className="text-xs text-red-500 mt-3 break-words">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      <button
        onClick={() => signOut()}
        title={`Signed in as ${user.email || user.displayName || "user"} — sign out`}
        className="fixed bottom-3 right-3 z-[120] flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-surface/80 backdrop-blur-xl border border-outline-variant/40 text-[11px] font-medium text-secondary hover:text-on-surface transition-colors"
      >
        <LogOut className="w-3 h-3" />
        <span className="hidden sm:inline max-w-[160px] truncate">{user.email || user.displayName || "Sign out"}</span>
      </button>
    </>
  );
}
