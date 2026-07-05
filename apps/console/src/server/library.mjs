/**
 * Agent Library bespoke GET routes, mounted by ge-api-router.mjs BEFORE the
 * generic /api/ge dispatch. library.{stats,search,inspect,status} are
 * read-only registry entries with no console job route (method/path null),
 * so they get a bespoke read handler here — same shape as
 * handleSystemsRequest/handleInterviewDocsRequest.
 *
 *   GET /api/ge/library/stats                        → readLibraryIndex()
 *   GET /api/ge/library/search?q=&department=&limit= → searchBlueprints()
 *   GET /api/ge/library/:slug                        → resolveBlueprint() + blueprintStatus()
 *     (:slug may itself contain "/", e.g. banking/aml-alert-investigation-agent —
 *     everything after the /api/ge/library/ prefix that isn't stats/search is the slug)
 *
 * create.fromLibrary (POST /api/ge/create) is NOT handled here — it is a
 * routed registry entry and dispatches through the generic handleGeApi job
 * path, same as agents.register.
 */
import { readLibraryIndex, searchBlueprints, resolveBlueprint, blueprintStatus } from "@ge/blueprint-library";

export async function handleLibraryRequest(req, responder) {
  const url = new URL(req.url || "/", "http://localhost");
  if (req.method !== "GET" || !url.pathname.startsWith("/api/ge/library/")) return null;
  const rest = url.pathname.slice("/api/ge/library/".length);

  try {
    if (rest === "stats") {
      return responder.json(200, await readLibraryIndex());
    }
    if (rest === "search") {
      const query = url.searchParams.get("q") || "";
      const department = url.searchParams.get("department") || undefined;
      const limit = Number(url.searchParams.get("limit"));
      const rows = await searchBlueprints(query, { department });
      // A non-numeric or non-positive limit is ignored, not treated as 0 —
      // Number("abc") is NaN and slice(0, NaN) would silently return [].
      const blueprints = Number.isFinite(limit) && limit > 0 ? rows.slice(0, limit) : rows;
      return responder.json(200, { ok: true, query, count: blueprints.length, blueprints });
    }
    if (rest) {
      const slug = decodeURIComponent(rest); // may contain "/" — resolveBlueprint accepts slug, id, or leaf
      const [blueprint, status] = await Promise.all([resolveBlueprint(slug), blueprintStatus(slug)]);
      return responder.json(200, { blueprint, status });
    }
  } catch (error) {
    // resolveBlueprint/blueprintStatus throw a GE-LIB-404-coded Error for an
    // unknown slug; every other failure is a real 500.
    const status = error.code === "GE-LIB-404" ? 404 : 500;
    return responder.json(status, { ok: false, error: error.message || String(error) });
  }
  return responder.json(404, { ok: false, error: "not found" });
}
