import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { auditSpec, computeStatus } from "./okf-quality.mjs";
async function fixture(files){ const base=join(process.cwd(), ".ge"); await mkdir(base,{recursive:true}); const root=await mkdtemp(join(base, "okf-quality-")); const dir=join(root,"pay-equity-audit"); await mkdir(dir,{recursive:true}); for(const [p,b] of Object.entries(files)){ await mkdir(join(dir,p,".."),{recursive:true}); await writeFile(join(dir,p),b); } return dir; }
const fm=(type,title,body="")=>`---\ntype: ${type}\ntitle: ${title}\ntags: [hr, okf]\n---\n\n# ${title}\n\n${body}\n`;
test("weak one-eval spec is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Pay Equity Audit"),"tests/run.md":fm("Eval Scenario","Run the Pay Equity Audit workflow for the current period.")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-EVAL-001"); expect(r.failedRules.map(f=>f.code)).toContain("OKF-EVAL-002"); });
test("action tool without state assertion is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","PO Agent"),"tools/create-po.md":fm("Agent Tool","action_create_po","- **Kind:** action\n\n## Side Effects\nMay change ERP state."),"tests/t.md":fm("Eval Scenario","Create PO","## Mechanisms to call\n- [action_create_po](/tools/create-po.md)\n")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-STATE-001"); });
test("HITL without approval eval is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Claims Agent","Requires human checkpoint before settlement."),"tests/t.md":fm("Eval Scenario","Claim happy path","Normal happy path.")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-HITL-001"); });
test("unknown tool reference fails", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Tool Agent"),"tests/t.md":fm("Eval Scenario","Tool eval","## Mechanisms to call\n- [missing_tool](/tools/missing-tool.md)\n")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-REF-001"); });
test("status cannot become proven without fresh proof", ()=>{ const report={contractValid:true, inventory:{evals:5}, score:{total:90}, allowedToClaimProven:false}; expect(computeStatus(report)).toBe("L4"); });
import { applyEnrichmentPatch, generateEnrichmentPatch, generateEnrichmentPlan, loadDomainPacks, matchDomainPacksForSpec, shardEnrichmentPlan, verifyOkfEvals } from "./okf-quality.mjs";

test("domain packs load and match by keywords", async()=>{
  const packs = await loadDomainPacks();
  expect(packs.map((p)=>p.id)).toContain("pay-equity");
  const matches = await matchDomainPacksForSpec("eco-impact-analysis-agent");
  expect(matches.map((m)=>m.id)).toContain("common");
});

test("enrichment plan creates concrete obligations and bounded shards", async()=>{
  const plan = await generateEnrichmentPlan({spec:"eco-impact-analysis-agent", target:"L4"});
  expect(plan.tasks.length).toBe(1);
  expect(plan.tasks[0].obligations.some((o)=>o.kind === "state_mutation")).toBe(true);
  expect(plan.tasks[0].obligations.some((o)=>o.kind === "prompt_injection")).toBe(true);
  const shards = shardEnrichmentPlan(plan);
  expect(shards.length).toBe(1);
  expect(shards[0].specs[0].id).toBe("eco-impact-analysis-agent");
});


test("eval verifier rejects generic evals, missing fixtures, and action evals without state assertions", async()=>{
  const d=await fixture({
    "index.md":fm("Knowledge Bundle","Verifier Agent"),
    "tools/create-case.md":fm("Agent Tool","action_create_case","- **Kind:** action\n\n## Side Effects\nMay change CRM state."),
    "tests/generic.md":fm("Eval Scenario","Run the Verifier Agent workflow for the current period.","## Mechanisms to call\n- [action_create_case](/tools/create-case.md)\n\nfixtureRefs: fixtures/verifier/missing.json\n")
  });
  const r=await verifyOkfEvals({spec:d});
  const codes=r.specs[0].errors.map((e)=>e.code);
  expect(codes).toContain("OKF-EVAL-002");
  expect(codes).toContain("OKF-FIXTURE-001");
  expect(codes).toContain("OKF-STATE-001");
});

test("eval verifier accepts deterministic action evals with args, fixture, and state assertion", async()=>{
  const d=await fixture({
    "index.md":fm("Knowledge Bundle","Verifier Agent"),
    "tools/create-case.md":fm("Agent Tool","action_create_case","- **Kind:** action\n\n## Side Effects\nMay change CRM state."),
    "fixtures/case.json":"{\"case_id\":\"CASE-1\"}\n",
    "tests/create-case.md":fm("Eval Scenario","Create case with approval","## Mechanisms to call\n- [action_create_case](/tools/create-case.md)\n\nexpected_tool_calls:\n- name: action_create_case\n  args:\n    case_id: CASE-1\nexpected_state_delta:\n  systems: [crm.cases]\ndeterministic_assertions:\n- state_mutation_recorded\nfixtureRefs: fixtures/case.json\n")
  });
  const r=await verifyOkfEvals({spec:d});
  expect(r.summary.ok).toBe(true);
});


test("enrichment patch generation emits reviewable files before apply", async()=>{
  const d=await fixture({
    "index.md":fm("Knowledge Bundle","Patch Agent"),
    "workflow/step.md":fm("Workflow Step","Assess request"),
    "tools/create-case.md":fm("Agent Tool","action_create_case","- **Kind:** action\n\n## Side Effects\nMay change CRM state.")
  });
  const patch=await generateEnrichmentPatch({spec:"pay-equity-audit", root:dirname(d), maxEvals:2});
  expect(patch.schemaVersion).toBe("okf-enrichment-patch.v1");
  expect(patch.adds.files.some((f)=>f.kind === "eval")).toBe(true);
  const dry=await applyEnrichmentPatch({patch, root:dirname(d), write:false});
  expect(dry.dryRun).toBe(true);
  expect(dry.writes.length).toBe(patch.adds.files.length);
});

test("audit reports fresh hash-bound proof binding", async()=>{
  const d=await fixture({
    "index.md":fm("Knowledge Bundle","Proof Agent"),
    "tests/assertive.md":fm("Eval Scenario","Assertive eval","deterministic_assertions:\n- ok\n")
  });
  const before=await auditSpec(d);
  await mkdir(join(d,"proof"),{recursive:true});
  await writeFile(join(d,"proof","proof-pack.json"), JSON.stringify({qualityBinding:{okfHash:before.hashes.okfHash, evalHash:before.hashes.evalHash, fixtureHash:before.hashes.fixtureHash, generatorHash:before.hashes.generatorHash, workspaceHash:before.hashes.workspaceHash, proofPolicyHash:before.hashes.proofPolicyHash}}, null, 2));
  const after=await auditSpec(d);
  expect(after.allowedToClaimProven).toBe(true);
  expect(after.proofBinding.allowed).toBe(true);
});


test("eval verifier parses expected_tool_calls names without Mechanisms section", async()=>{
  const d=await fixture({
    "index.md":fm("Knowledge Bundle","Expected Tool Agent"),
    "tests/expected-tool.md":fm("Eval Scenario","Expected tool only","expected_tool_calls:\n- name: invented_tool\n  args:\n    id: CASE-1\ndeterministic_assertions:\n- tool_checked\n")
  });
  const r=await verifyOkfEvals({spec:d});
  expect(r.specs[0].errors.map((e)=>e.code)).toContain("OKF-REF-001");
});
