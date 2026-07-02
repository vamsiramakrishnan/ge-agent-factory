"""Shared id / name / noun helpers for system synthesis.

Extracted verbatim from ``synthesis.py`` (see the parity oracle in
``test_synthesis_golden.py``). ``synthesis.py`` re-exports everything here, so
``synthesis.slugify`` etc. keep working for existing callers.
"""

from __future__ import annotations

import re

_STOPWORDS = {
    "the", "a", "an", "and", "or", "for", "with", "that", "this", "our", "their", "system",
    "agent", "data", "into", "from", "have", "has", "are", "is", "to", "of", "in", "on", "we",
    "homegrown", "internal", "custom", "tool", "platform", "app", "application", "service",
}
_APPROVAL_HINTS = ("approval", "approve", "review", "sign-off", "sign off", "authorization", "gate")

_APPROVAL_NOUNS = {"approval", "approvals", "approve", "review", "signoff", "authorization", "flow", "gate", "step", "sign"}


def slugify(value: str, *, prefix: str = "byo_") -> str:
    slug = re.sub(r"[^a-z0-9]+", "_", (value or "").lower()).strip("_")
    slug = slug or "system"
    return slug if slug.startswith(prefix) else f"{prefix}{slug}"


def _singular(word: str) -> str:
    if word.endswith("ies") and len(word) > 3:
        return word[:-3] + "y"
    if word.endswith("ses") or word.endswith("xes") or word.endswith("zes") or word.endswith("ches") or word.endswith("shes"):
        return word[:-2]
    if word.endswith("s") and not word.endswith("ss"):
        return word[:-1]
    return word


def _pluralize(word: str) -> str:
    if word.endswith("y") and len(word) > 1 and word[-2] not in "aeiou":
        return word[:-1] + "ies"
    if word.endswith(("s", "x", "z", "ch", "sh")):
        return word + "es"
    return word + "s"


def _resolve_ref_collection(base: str, collections) -> str | None:
    """Map a ``<base>_id`` FK base to a real collection name, honoring pluralization.

    Real schemas use plural collection names (field ``team_id`` → collection ``teams``),
    so a bare ``base in collections`` test misses the FK. Tries the same candidates as the
    JS tier's ``inferRefCollection`` (base, base+s, base→ies, …). ``collections`` may be any
    container supporting ``in`` (dict of specs or set of names).
    """
    if not base:
        return None
    candidates = [base, _pluralize(base), f"{base}s", f"{base}es"]
    if base.endswith("y") and len(base) > 1:
        candidates.append(f"{base[:-1]}ies")
    for candidate in candidates:
        if candidate in collections:
            return candidate
    return None


def _extract_nouns(description: str, *, system_id: str, display_name: str | None, limit: int = 6) -> list[str]:
    """Pull likely entity nouns (singularized) from a description, minus stopwords/name."""
    name_tokens = set(re.findall(r"[a-z]+", (display_name or "").lower()))
    name_tokens.add(system_id.removeprefix("byo_"))
    words = re.findall(r"[a-zA-Z][a-zA-Z_]+", description.lower())
    candidates = [w for w in words if w not in _STOPWORDS and len(w) > 2 and _singular(w) not in name_tokens]
    nouns: list[str] = []
    for w in candidates:
        base = _singular(w)
        if base not in nouns and base not in _APPROVAL_NOUNS:
            nouns.append(base)
    return nouns[:limit]
