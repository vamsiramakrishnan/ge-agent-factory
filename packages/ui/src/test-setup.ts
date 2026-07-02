// Registers happy-dom as the global DOM for @ge/ui render tests. Lives in its
// own module so test files can guarantee it evaluates BEFORE
// @testing-library/dom (which binds `screen` to document.body at import time):
// ESM hoists all imports, so an inline register() call in the test file would
// run after the library import. Import this first.
//
// IMPORTANT: `bun test` runs the whole suite in ONE process, so a registered
// DOM leaks into every test file that runs after this one — and parts of the
// suite branch on `typeof window`. Test files that import this MUST call
// `unregisterDom()` in an afterAll so the globals are restored when the file
// finishes.
import { GlobalRegistrator } from "@happy-dom/global-registrator";

GlobalRegistrator.register();

export async function unregisterDom() {
  await GlobalRegistrator.unregister();
}
