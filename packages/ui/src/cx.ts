// Minimal className joiner — the only class utility these primitives need.
// (Deliberately not clsx/tailwind-merge: call sites own their overrides and
// the variant maps below never emit conflicting utilities.)
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
