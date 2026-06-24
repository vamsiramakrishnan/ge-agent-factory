import { useState, useEffect, type ReactNode } from "react";
import type { User } from "firebase/auth";
import { authEnabled, subscribe, signInWithGoogle } from "./firebase";

// Gates the SPA behind Google sign-in when auth is enabled. When auth is OFF
// (`authEnabled === false`) this renders children immediately with no subscription
// and no UI change — the default-off contract for the IAP-fronted central deploy.
export function AuthGate({ children }: { children: ReactNode }) {
  // When auth is off we never touch Firebase; render children straight through.
  if (!authEnabled) return <>{children}</>;
  return <AuthGateActive>{children}</AuthGateActive>;
}

function AuthGateActive({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribe((u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  if (user) return <>{children}</>;

  const onSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || "Sign-in failed");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-auto px-8 py-10 rounded-xl border border-outline-variant/30 bg-surface text-center">
        <h1 className="text-lg font-semibold text-on-surface">GE Agent Factory</h1>
        <p className="mt-2 text-sm text-secondary">
          {ready ? "Sign in to continue." : "Loading…"}
        </p>
        <button
          onClick={onSignIn}
          disabled={signingIn || !ready}
          className="mt-6 w-full px-4 py-2.5 text-sm font-medium rounded-lg bg-primary text-on-primary hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {signingIn ? "Signing in…" : "Sign in with Google"}
        </button>
        {error && <p className="mt-4 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
