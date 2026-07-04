// DxError moved to @ge/std/dx-error so leaf packages (e.g. @ge/evalkit) can
// throw the same four-field what/where/why/fix contract without importing
// tools/*. This re-export keeps every existing tools/apps import path — and,
// because it is the same module instance, `instanceof DxError` — working
// unchanged. New code may import @ge/std/dx-error directly.
export { DxError, dxError, isDxError, dxErrorShape } from "@ge/std/dx-error";
