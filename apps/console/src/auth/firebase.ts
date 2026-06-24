// Opt-in Firebase Google sign-in for the console SPA.
//
// Default-OFF contract: `authEnabled` is false unless BOTH VITE_AUTH_MODE==="firebase"
// AND VITE_FIREBASE_API_KEY are present at build time. When disabled every export is a
// no-op (subscribe immediately reports "no user but auth off", getToken() === null), so
// the app renders exactly as it does today and no Firebase SDK is ever initialized.
// The central deployment is fronted by IAP and sets none of these — it stays untouched.
import type { FirebaseApp } from "firebase/app";
import type { Auth, User } from "firebase/auth";

const AUTH_MODE = import.meta.env.VITE_AUTH_MODE;
const API_KEY = import.meta.env.VITE_FIREBASE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_FIREBASE_PROJECT_ID;

export const authEnabled: boolean = AUTH_MODE === "firebase" && !!API_KEY;

// Lazily created singletons — only ever touched when authEnabled.
let appPromise: Promise<Auth> | null = null;

async function getAuthInstance(): Promise<Auth | null> {
  if (!authEnabled) return null;
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps } = await import("firebase/app");
      const { getAuth } = await import("firebase/auth");
      const config = {
        apiKey: API_KEY,
        authDomain: AUTH_DOMAIN,
        projectId: PROJECT_ID,
      };
      const existing = getApps();
      const app: FirebaseApp = existing.length ? existing[0] : initializeApp(config);
      return getAuth(app);
    })();
  }
  return appPromise;
}

// Subscribe to auth state. Returns an unsubscribe fn. When auth is disabled we
// invoke the callback once with null and never change — callers treat null as
// "no gate" because they also read `authEnabled`.
export function subscribe(cb: (user: User | null) => void): () => void {
  if (!authEnabled) {
    cb(null);
    return () => {};
  }
  let unsub: (() => void) | null = null;
  let cancelled = false;
  (async () => {
    const auth = await getAuthInstance();
    if (!auth || cancelled) return;
    const { onAuthStateChanged } = await import("firebase/auth");
    unsub = onAuthStateChanged(auth, (u) => cb(u));
  })();
  return () => {
    cancelled = true;
    if (unsub) unsub();
  };
}

export async function signInWithGoogle(): Promise<void> {
  if (!authEnabled) return;
  const auth = await getAuthInstance();
  if (!auth) return;
  const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
  await signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOut(): Promise<void> {
  if (!authEnabled) return;
  const auth = await getAuthInstance();
  if (!auth) return;
  const { signOut: fbSignOut } = await import("firebase/auth");
  await fbSignOut(auth);
}

// Current user's Firebase ID token, or null. Used to attach Authorization to
// /api/* requests. Returns null whenever auth is off or no user is signed in.
export async function getToken(): Promise<string | null> {
  if (!authEnabled) return null;
  const auth = await getAuthInstance();
  if (!auth || !auth.currentUser) return null;
  try {
    return await auth.currentUser.getIdToken();
  } catch {
    return null;
  }
}
