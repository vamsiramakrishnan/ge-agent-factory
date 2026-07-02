// Filesystem anchors for transports that spawn the `ge` CLI (jobs' local
// fallback, the doctor subprocess). apps/console/src/server/transport/ ->
// repo root is five levels up.
import { join } from "node:path";

export const REPO_ROOT = join(import.meta.dirname, "..", "..", "..", "..", "..");
export const GE_CLI = join(REPO_ROOT, "tools", "ge.mjs");
