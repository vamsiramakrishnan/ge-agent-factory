// Opt-in Google sign-in for the presentation SPA.
//
// Inert by default: when VITE_AUTH_MODE !== "firebase" (or the API key is
// missing) `authEnabled` is false and every export below is a no-op, so the
// deck renders exactly as it does today and the central IAP deployment is
// untouched.

import type { Auth, User } from "firebase/auth";

export const authEnabled =
  import.meta.env.VITE_AUTH_MODE === "firebase" &&
  !!import.meta.env.VITE_FIREBASE_API_KEY;

let authPromise: Promise<Auth> | null = null;

// Lazily initialize Firebase only when auth is enabled, so the firebase SDK
// stays out of the hot path (and bundle critical path) when it is off.
async function getAuthInstance(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const { initializeApp } = await import("firebase/app");
      const { getAuth } = await import("firebase/auth");
      const app = initializeApp({
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      });
      return getAuth(app);
    })();
  }
  return authPromise;
}

/**
 * Subscribe to auth-state changes. Returns an unsubscribe function. When auth
 * is disabled the callback never fires and unsubscribe is a no-op.
 */
export function subscribe(cb: (user: User | null) => void): () => void {
  if (!authEnabled) return () => {};
  let unsub: (() => void) | null = null;
  let cancelled = false;
  getAuthInstance().then(async (auth) => {
    if (cancelled) return;
    const { onAuthStateChanged } = await import("firebase/auth");
    unsub = onAuthStateChanged(auth, cb);
  });
  return () => {
    cancelled = true;
    if (unsub) unsub();
  };
}

export async function signInWithGoogle(): Promise<void> {
  if (!authEnabled) return;
  const auth = await getAuthInstance();
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOut(): Promise<void> {
  if (!authEnabled) return;
  const auth = await getAuthInstance();
  const { signOut: fbSignOut } = await import("firebase/auth");
  await fbSignOut(auth);
}

/** Current user's Firebase ID token, or null when signed out / disabled. */
export async function getToken(): Promise<string | null> {
  if (!authEnabled) return null;
  const auth = await getAuthInstance();
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}
