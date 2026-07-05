import { describe, expect, test } from "bun:test";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { auditSpec, computeStatus } from "./okf-quality.mjs";
async function fixture(files){ const root=await mkdtemp(join(tmpdir(),"okf-quality-")); const dir=join(root,"pay-equity-audit"); await mkdir(dir,{recursive:true}); for(const [p,b] of Object.entries(files)){ await mkdir(join(dir,p,".."),{recursive:true}); await writeFile(join(dir,p),b); } return dir; }
const fm=(type,title,body="")=>`---\ntype: ${type}\ntitle: ${title}\ntags: [hr, okf]\n---\n\n# ${title}\n\n${body}\n`;
test("weak one-eval spec is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Pay Equity Audit"),"tests/run.md":fm("Eval Scenario","Run the Pay Equity Audit workflow for the current period.")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-EVAL-001"); expect(r.failedRules.map(f=>f.code)).toContain("OKF-EVAL-002"); });
test("action tool without state assertion is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","PO Agent"),"tools/create-po.md":fm("Agent Tool","action_create_po","- **Kind:** action\n\n## Side Effects\nMay change ERP state."),"tests/t.md":fm("Eval Scenario","Create PO","## Mechanisms to call\n- [action_create_po](/tools/create-po.md)\n")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-STATE-001"); });
test("HITL without approval eval is flagged", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Claims Agent","Requires human checkpoint before settlement."),"tests/t.md":fm("Eval Scenario","Claim happy path","Normal happy path.")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-HITL-001"); });
test("unknown tool reference fails", async()=>{ const d=await fixture({"index.md":fm("Knowledge Bundle","Tool Agent"),"tests/t.md":fm("Eval Scenario","Tool eval","## Mechanisms to call\n- [missing_tool](/tools/missing-tool.md)\n")}); const r=await auditSpec(d); expect(r.failedRules.map(f=>f.code)).toContain("OKF-REF-001"); });
test("status cannot become proven without fresh proof", ()=>{ const report={contractValid:true, inventory:{evals:5}, score:{total:90}, allowedToClaimProven:false}; expect(computeStatus(report)).toBe("L4"); });
import { generateEnrichmentPlan, loadDomainPacks, matchDomainPacksForSpec, shardEnrichmentPlan } from "./okf-quality.mjs";

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
