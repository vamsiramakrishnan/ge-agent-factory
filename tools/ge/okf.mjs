// tools/ge/okf.mjs — OKF knowledge substrate commands.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { defineCommand } from "citty";
import pc from "picocolors";
import { readOkfBundle, baseConformance, renderConcept, writeConceptFile } from "../../packages/okf/src/index.mjs";
import { specToOkf } from "../../apps/factory/scripts/spec-to-okf.mjs";
import { okfToSpec } from "../../apps/factory/scripts/okf-to-spec.mjs";
import { compileOkfBundle, toDxError } from "../../packages/okf/src/compile/index.mjs";
import { customizeVariant, parsePairs } from "../lib/okf-lifecycle.mjs";
import { auditQuality, generateEnrichmentPlan, loadDomainPacks, matchDomainPacksForSpec, renderQualityMarkdown, shardEnrichmentPlan, verifyOkfEvals } from "../lib/okf-quality.mjs";
import { common, emit, guarded, out, ui } from "./shared.mjs";

const EDGE_KIND = { Authority:"authority", "Required Evidence":"evidence", Tools:"tool", Evals:"eval", Citations:"citation", Risks:"risk", "Used By":"used_by", Capabilities:"capability", "Source Systems":"source_system", Workflow:"workflow", Persona:"persona", "Synthetic World":"world", "Live Proof":"live_proof" };
function graphFromBundle(bundle, { cytoscape = false } = {}) {
  const ids = new Set(bundle.concepts.map(c=>c.id));
  const nodes = bundle.concepts.map(c=>({ id:c.id, path:c.path, type:c.type, title:c.title, tags:c.tags || [] }));
  const edges = [];
  const warnings = [...(bundle.warnings || [])];
  for (const c of bundle.concepts) for (const section of c.sections) {
    const kind = EDGE_KIND[section.title] || "related";
    for (const l of c.links.filter(x => section.body.includes(`[${x.text}](${x.href})`))) {
      if (!l.target) continue;
      if (!ids.has(l.target)) warnings.push({ level:"warning", code:"OKF_GRAPH_BROKEN_LINK", path:c.path, target:l.target });
      edges.push({ from:c.id, to:l.target, kind, sourceSection:section.title, text:l.text });
    }
  }
  if (cytoscape) return { elements: { nodes: nodes.map(data=>({data})), edges: edges.map((e,i)=>({data:{ id:`e${i}`, source:e.from, target:e.to, ...e }})) }, warnings };
  return { apiVersion:"ge.dev/v1", kind:"OkfGraph", bundle:bundle.root, nodes, edges, warnings };
}
function coverageFromGraph(graph) {
  const byType = (t) => graph.nodes.filter(n=>n.type === t).map(n=>n.id);
  const edge = (from, kind) => graph.edges.some(e=>e.from===from && e.kind===kind);
  const claims = byType("Claim"), caps = graph.nodes.filter(n=>/Capability/.test(n.type)).map(n=>n.id), tools = byType("Tool");
  return { apiVersion:"ge.dev/v1", kind:"OkfCoverage", bundle:graph.bundle, claims:{ total:claims.length, withAuthority:claims.filter(id=>edge(id,"authority")).length, withCitation:claims.filter(id=>edge(id,"citation")).length, liveProven:0 }, capabilities:{ total:caps.length, withEval:caps.filter(id=>edge(id,"eval")).length, liveProven:0 }, tools:{ total:tools.length, exercisedLive:0, writeToolsCovered:0 }, gaps:[] };
}
async function auditBundle(path, { strict=false } = {}) {
  const bundle = await readOkfBundle(path); const graph = graphFromBundle(bundle); const conf = baseConformance(bundle);
  const warnings = [...conf.warnings], blockers = [...conf.blockers];
  const hasRootIndex = bundle.indexes.some(i=>i.path === "index.md"); if (!hasRootIndex) warnings.push({code:"GEOKF_ROOT_INDEX_MISSING", what:"Root index.md is missing"});
  if (!bundle.logs.some(l=>l.path === "log.md")) warnings.push({code:"GEOKF_LOG_MISSING", what:"Root log.md is missing"});
  const claims = graph.nodes.filter(n=>n.type === "Claim");
  for (const c of claims) { const edges = graph.edges.filter(e=>e.from===c.id); if(!edges.some(e=>e.kind==="authority")) blockers.push({code:"GEOKF_AUTHORITY_MISSING", what:"Claim has no authority", where:c.path}); if((c.tags||[]).includes("high-risk") && !edges.some(e=>e.kind==="citation")) blockers.push({code:"GEOKF_AUTHORITY_MISSING_CITATION", what:"High-risk claim has no citation", where:c.path}); }
  for (const n of graph.nodes.filter(n=>n.type==="Eval")) if(!graph.edges.some(e=>e.from===n.id && e.kind==="capability")) blockers.push({code:"GEOKF_EVAL_CAPABILITY_MISSING", what:"Eval does not link to a capability", where:n.path});
  let compileOk = true; try { await okfToSpec(path); } catch (e) { compileOk = false; blockers.push({code:"GEOKF_COMPILE_FAILED", what:e.message}); }
  if (strict) blockers.push(...warnings.map(w=>({...w, code:w.code||"GEOKF_STRICT_WARNING"})));
  const score = (bad,total)=> total ? Math.max(0,1-bad/total) : 1;
  return { apiVersion:"ge.dev/v1", kind:"OkfAuditResult", bundle:path, scores:{ conformance:conf.ok?1:0, navigability:score(warnings.length, Math.max(1,bundle.concepts.length)), semanticCoverage:score(blockers.length, Math.max(1,bundle.concepts.length)), behavioralCoverage:score(graph.nodes.filter(n=>/Capability/.test(n.type)).length - coverageFromGraph(graph).capabilities.withEval, Math.max(1, graph.nodes.length)), consumptionReady:compileOk?1:0, citationCoverage:score(claims.length-claims.filter(c=>graph.edges.some(e=>e.from===c.id&&e.kind==="citation")).length, Math.max(1,claims.length)), authorityCoverage:score(claims.length-claims.filter(c=>graph.edges.some(e=>e.from===c.id&&e.kind==="authority")).length, Math.max(1,claims.length)), roundTrip:compileOk?1:0 }, blockers, warnings, next:blockers[0]?.where ? [`ge okf explain ${blockers[0].where.replace(/\.md$/,"")} --bundle ${path}`] : [] };
}
function renderAudit(r){ out(ui.title("OKF Audit", r.bundle)); for(const [k,v] of Object.entries(r.scores)) out(`  ${k.padEnd(20)} ${v===1?pc.green("✓"):v<0.7?pc.red("✗"):pc.yellow("▲")} ${Math.round(v*100)}%`); if(r.blockers.length){out("Blockers"); for(const b of r.blockers) out(`  ${pc.red("✗")} ${b.code} ${pc.dim(b.where||"")} ${b.what||b.message||""}`);} if(r.warnings.length){out("Warnings"); for(const w of r.warnings.slice(0,10)) out(`  ${pc.yellow("▲")} ${w.code||"warning"} ${w.where||w.path||""} ${w.what||w.message||""}`);} if(r.next[0]) out(ui.next(r.next[0])); }
async function explainConcept(id,bundlePath){ const bundle=await readOkfBundle(bundlePath); const graph=graphFromBundle(bundle); const c=bundle.concepts.find(x=>x.id===id||x.path===id||x.path===`${id}.md`); if(!c) throw new Error(`OKF concept not found: ${id}`); const outEdges=graph.edges.filter(e=>e.from===c.id), inEdges=graph.edges.filter(e=>e.to===c.id); return { apiVersion:"ge.dev/v1", kind:"OkfExplain", concept:{id:c.id,path:c.path,type:c.type,title:c.title}, authority:outEdges.filter(e=>e.kind==="authority").map(e=>e.to), usedBy:inEdges.map(e=>e.from), provenBy:outEdges.filter(e=>e.kind==="eval"||e.kind==="live_proof").map(e=>e.to), risks:outEdges.filter(e=>e.kind==="risk").map(e=>e.to), citations:outEdges.filter(e=>e.kind==="citation").map(e=>e.to), liveProof:"no live proof artifact found", next:`ge prove --live --claim ${c.id.split('/').pop()}` }; }
function renderExplain(r){ out(ui.title(`${r.concept.type}: ${r.concept.title||r.concept.id}`)); for(const [label,items] of [["Authority",r.authority],["Used by",r.usedBy],["Proven by",r.provenBy],["Risks",r.risks],["Citations",r.citations]]){ out(label); if(items.length) items.forEach(i=>out(`  ${pc.green("✓")} ${i}`)); else out(`  ${pc.yellow("▲")} none`); } out(`  ${pc.dim(r.liveProof)}`); out(ui.next(r.next)); }
async function writeSpec(outPath, spec){ await mkdir(dirname(outPath),{recursive:true}); await writeFile(outPath, JSON.stringify(spec,null,2)+"\n"); }
async function writeJson(outPath, value){ await mkdir(dirname(outPath),{recursive:true}); await writeFile(outPath, JSON.stringify(value,null,2)+"\n"); }
async function compileAllCatalogSpecs(outDir){
  const catalogPath = resolve("apps/factory/generated/use-cases.generated.json");
  const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
  const specs = Array.isArray(catalog) ? catalog : catalog.useCases || catalog.items || Object.values(catalog);
  const bundles = [];
  const failures = [];
  let totalConcepts = 0;
  for (const spec of specs) {
    const id = spec?.id;
    if (!id) continue;
    const bundleDir = join(outDir, id);
    try {
      const compiled = await specToOkf({ id, out: bundleDir });
      const audit = await auditBundle(compiled.bundle, { strict: false });
      const bundle = await readOkfBundle(compiled.bundle);
      const graph = graphFromBundle(bundle);
      const coverage = coverageFromGraph(graph);
      await writeJson(join(compiled.bundle, ".ge", "okf-audit.json"), audit);
      await writeJson(join(compiled.bundle, ".ge", "okf-graph.json"), graph);
      await writeJson(join(compiled.bundle, ".ge", "okf-coverage.json"), coverage);
      totalConcepts += compiled.conceptCount;
      bundles.push({ id, bundle: compiled.bundle, conceptCount: compiled.conceptCount, graph: { nodes: graph.nodes.length, edges: graph.edges.length }, audit: audit.scores, blockers: audit.blockers.length, warnings: audit.warnings.length });
    } catch (error) {
      failures.push({ id, error: error?.message || String(error) });
    }
  }
  const summary = { apiVersion:"ge.dev/v1", kind:"OkfBulkCompileResult", source:catalogPath, out:outDir, requested:specs.length, generated:bundles.length, failed:failures.length, totalConcepts, bundles, failures };
  await writeJson(join(outDir, "bulk-okf-summary.json"), summary);
  return summary;
}

function renderQualityAudit(r){
  out(ui.title("OKF Quality Audit"));
  out(ui.kv([
    ["blueprints", String(r.summary.total)],
    ["average score", String(r.summary.averageScore)],
    ["failed rules", String(r.summary.failedRules)],
  ]));
  out("Status");
  for (const [status, count] of Object.entries(r.summary.byStatus)) out(`  ${status.padEnd(2)} ${count}`);
  out("Risk");
  for (const [risk, count] of Object.entries(r.summary.byRisk)) out(`  ${risk.padEnd(10)} ${count}`);
  const worst = [...r.specs].sort((a,b)=>a.score.total-b.score.total).slice(0,10);
  if (worst.length) {
    out("Lowest scoring blueprints");
    for (const s of worst) out(`  ${s.slug} · ${s.currentStatus} · ${s.risk.tier} · ${s.score.total} · ${s.failedRules.length} gaps`);
  }
}
const qualityAudit=defineCommand({ meta:{name:"audit",description:"Compute deterministic L0-L5 OKF blueprint quality reports"}, args:{...common, all:{type:"boolean"}, spec:{type:"string"}, changed:{type:"boolean"}, root:{type:"string",default:"okf"}, "fail-under":{type:"string",description:"Fail if any audited spec score is below this threshold"}, write:{type:"string",description:"Write JSON report to this path"}, markdown:{type:"string",description:"Write Markdown report to this path"}}, async run({args}){ const result=await auditQuality({ all:args.all, spec:args.spec, changed:args.changed, root:args.root }); if(args.write) await writeJson(args.write,result); if(args.markdown) { await mkdir(dirname(args.markdown),{recursive:true}); await writeFile(args.markdown, renderQualityMarkdown(result)); } const min = args["fail-under"] ? Number(args["fail-under"]) : null; if (Number.isFinite(min)) { const bad=result.specs.filter(s=>s.score.total<min); if(bad.length) throw new Error(`OKF quality score below ${min}: ${bad.map(s=>`${s.slug}=${s.score.total}`).join(", ")}`); } emit(args,result,renderQualityAudit); }});
const quality=defineCommand({ meta:{name:"quality",description:"Quality status, scoring, and deterministic audit for OKF blueprints"}, subCommands:{audit:qualityAudit} });


function renderDomainPacks(r){
  if (Array.isArray(r)) for (const p of r) out(`${p.id} · ${p.name} · ${p.invariants?.length || 0} invariants · ${p.eval_seeds?.length || 0} seeds`);
  else out(JSON.stringify(r, null, 2));
}
const domainPacksList=defineCommand({ meta:{name:"list",description:"List reusable OKF enrichment domain packs"}, args:{...common, root:{type:"string",default:"domain-packs"}}, async run({args}){ emit(args, await loadDomainPacks({root:args.root}), renderDomainPacks); }});
const domainPacksInspect=defineCommand({ meta:{name:"inspect",description:"Inspect one OKF enrichment domain pack"}, args:{...common, id:{type:"positional",required:true}, root:{type:"string",default:"domain-packs"}}, async run({args}){ const packs=await loadDomainPacks({root:args.root}); const pack=packs.find((p)=>p.id===args.id); if(!pack) throw new Error(`domain pack not found: ${args.id}`); emit(args, pack, renderDomainPacks); }});
const domainPacksMatch=defineCommand({ meta:{name:"match",description:"Match a spec to deterministic domain packs"}, args:{...common, spec:{type:"string",required:true}, root:{type:"string",default:"okf"}, "pack-root":{type:"string",default:"domain-packs"}}, async run({args}){ emit(args, await matchDomainPacksForSpec(args.spec,{okfRoot:args.root,packRoot:args["pack-root"]}), (r)=>out(JSON.stringify(r,null,2))); }});
const domainPacks=defineCommand({ meta:{name:"domain-packs",description:"Reusable enrichment invariant and eval seed packs"}, subCommands:{list:domainPacksList, inspect:domainPacksInspect, match:domainPacksMatch} });
function renderEnrichPlan(r){ out(ui.title("OKF Enrichment Plan")); out(ui.kv([["target", r.targetStatus], ["tasks", String(r.summary.tasks)], ["obligations", String(r.summary.obligations)]])); for (const t of r.tasks.slice(0,10)) out(`  ${t.specId} · ${t.riskTier} · ${t.currentStatus}->${t.targetStatus} · ${t.obligations.length} obligations`); }
const enrichPlan=defineCommand({ meta:{name:"plan",description:"Generate coverage obligations for OKF blueprint enrichment"}, args:{...common, all:{type:"boolean"}, spec:{type:"string"}, target:{type:"string",default:"L4"}, root:{type:"string",default:"okf"}, "pack-root":{type:"string",default:"domain-packs"}, write:{type:"string",description:"Write plan JSON to this path"}}, async run({args}){ const result=await generateEnrichmentPlan({all:args.all,spec:args.spec,root:args.root,packRoot:args["pack-root"],target:args.target}); if(args.write) await writeJson(args.write,result); emit(args,result,renderEnrichPlan); }});
const enrichShard=defineCommand({ meta:{name:"shard",description:"Group an enrichment plan into bounded parallel shard manifests"}, args:{...common, plan:{type:"string",required:true}, out:{type:"string",required:true}}, async run({args}){ const plan=JSON.parse(await readFile(args.plan,"utf8")); const shards=shardEnrichmentPlan(plan); await mkdir(args.out,{recursive:true}); for (const shard of shards) await writeJson(join(args.out, `${shard.id}.json`), shard); emit(args,{schemaVersion:"okf-enrichment-shards.v1",out:args.out,shards}, (r)=>out(`Wrote ${r.shards.length} shard(s) to ${r.out}`)); }});
const enrich=defineCommand({ meta:{name:"enrich",description:"Plan and shard OKF blueprint enrichment work"}, subCommands:{plan:enrichPlan, shard:enrichShard} });


function renderEvalVerify(r){
  out(ui.title("OKF Eval Verify"));
  out(ui.kv([["specs", String(r.summary.specs)], ["evals", String(r.summary.evals)], ["errors", String(r.summary.errors)], ["warnings", String(r.summary.warnings)]]));
  for (const spec of r.specs.filter((s)=>!s.ok).slice(0,10)) {
    out(`${spec.specId} · ${spec.errors.length} error(s)`);
    for (const err of spec.errors.slice(0,5)) out(`  ${pc.red("✗")} ${err.code} ${pc.dim(err.path)} ${err.message}`);
  }
}
const evalVerify=defineCommand({ meta:{name:"verify",description:"Static verification for OKF eval references, fixtures, assertions, and action-tool state coverage"}, args:{...common, all:{type:"boolean"}, spec:{type:"string"}, changed:{type:"boolean"}, root:{type:"string",default:"okf"}}, async run({args}){ const result=await verifyOkfEvals({all:args.all,spec:args.spec,changed:args.changed,root:args.root}); emit(args,result,renderEvalVerify); if(!result.summary.ok) throw new Error(`OKF eval verification failed: ${result.summary.errors} error(s)`); }});
const evalGroup=defineCommand({ meta:{name:"eval",description:"Static OKF eval verification"}, subCommands:{verify:evalVerify} });

const audit=defineCommand({ meta:{name:"audit",description:"Audit an OKF bundle across base conformance, navigability, semantics, behavior, and consumption readiness"}, args:{...common, bundle:{type:"positional",required:true}, strict:{type:"boolean"}}, async run({args}){ emit(args, await auditBundle(resolve(args.bundle),{strict:args.strict}), renderAudit); }});
const graph=defineCommand({ meta:{name:"graph",description:"Extract concept authority/relationship graph from an OKF bundle"}, args:{...common, bundle:{type:"positional",required:true}, format:{type:"string",description:"json or cytoscape"}}, async run({args}){ const b=await readOkfBundle(resolve(args.bundle)); emit(args, graphFromBundle(b,{cytoscape:args.format==="cytoscape"}), r=>out(JSON.stringify(r,null,2))); }});
const explain=defineCommand({ meta:{name:"explain",description:"Explain one OKF concept's authority, backlinks, proof, citations, and gaps"}, args:{...common, concept:{type:"positional",required:true}, bundle:{type:"string",description:"OKF bundle directory",default:"okf"}}, async run({args}){ emit(args, await explainConcept(args.concept, resolve(args.bundle)), renderExplain); }});
const compile=defineCommand({ meta:{name:"compile",description:"Compile spec→OKF bundle or OKF bundle→spec (typed compiler with variant resolution)"}, args:{...common, from:{type:"string"}, to:{type:"string"}, spec:{type:"string"}, bundle:{type:"string"}, out:{type:"string",required:true}, all:{type:"boolean",description:"Compile every generated catalog agent spec into an OKF bundle and write audit/graph/coverage sidecars"}, "variant-base":{type:"string",description:"Base bundle directory for a variant bundle (default: sibling directory named after the root's variant_of id)"}}, run: guarded(async ({args})=>{ if(args.all){ const result = await compileAllCatalogSpecs(resolve(args.out)); return emit(args, result, r=>out(`OKF bundles: ${r.generated}/${r.requested} generated · ${r.totalConcepts} concepts · ${r.failed} failed · ${r.out}`)); } if(args.from==="spec"&&args.to==="bundle") return emit(args, await specToOkf({spec:args.spec,out:args.out}), r=>out(`OKF bundle: ${r.bundle} (${r.conceptCount} concepts)`)); if(args.from==="bundle"&&args.to==="spec"){ const variantBase=args["variant-base"]; const result=await compileOkfBundle(resolve(args.bundle),{ baseDir: variantBase ? resolve(variantBase) : undefined }); if(result.errors.length) throw toDxError(result.errors, args.bundle); await writeSpec(args.out,result.spec); return emit(args,{out:args.out},r=>out(`Spec: ${r.out}`)); } throw new Error("usage: ge okf compile --all --out <dir> OR --from spec --to bundle --spec <path> --out <dir> OR --from bundle --to spec --bundle <dir> [--variant-base <dir>] --out <spec.json>"); })});
const diff=defineCommand({ meta:{name:"diff",description:"Machine-readable OKF/spec round-trip diff summary"}, args:{...common,left:{type:"positional",required:true},right:{type:"positional",required:true}}, async run({args}){ const [l,r]=await Promise.all([readFile(args.left,"utf8"),readFile(args.right,"utf8")]); const result={status:l===r?"passed":"warning", preserved:{bytes:{before:l.length,after:r.length}}, changed:l===r?[]:[{field:"file", before:args.left, after:args.right}], lost:[], added:[], unmapped:[]}; emit(args,result,x=>out(JSON.stringify(x,null,2))); }});
// `ge okf customize` — customize a base agent into a variant bundle and
// compile it against that base immediately, so a bad swap/rename fails here (with the
// compiler's structured what/where/why/fix) instead of at register time.
// Bundles resolve under the OKF corpus root (GE_OKF_ROOT, default okf/).
function renderCustomize(r){
  out(ui.title("OKF Variant", r.agentId));
  out(ui.kv([
    ["base", ui.cmd(r.baseId)],
    ["kind", r.variantKind],
    ["bundle", pc.dim(r.out)],
    ["compile", r.compile.errors ? pc.red(`${r.compile.errors} errors`) : pc.green(`ok — ${r.compile.systems.length} systems · ${r.compile.tools} tools · ${r.compile.workflowSteps} workflow steps`)],
  ]));
  for (const f of r.files) out(pc.dim(`  ${f}`));
  out(ui.next(r.next, "register the variant once it says what you mean"));
}
const customize=defineCommand({
  meta:{name:"customize",description:"Customize a base agent into a variant bundle (system swaps, terminology, vertical policy overlay) and compile it against the base"},
  args:{
    ...common,
    base:{type:"string",required:true,description:"Base agent id (under the OKF corpus root) or an explicit bundle directory"},
    id:{type:"string",required:true,description:"New agent id for the variant bundle"},
    "swap-system":{type:"string",description:"System swap <from>=<to> (repeatable, or comma-separated)"},
    rename:{type:"string",description:"Terminology rewrite <term>=<replacement> (repeatable, or comma-separated)"},
    vertical:{type:"string",description:"Vertical name — sets variant_kind vertical and adds a policy-overlay stub"},
    out:{type:"string",description:"Output bundle directory (default <okf root>/<id>)"},
  },
  run: guarded(async ({args})=>{
    const result = await customizeVariant({
      base: args.base,
      id: args.id,
      swapSystems: parsePairs(args["swap-system"], "--swap-system"),
      renames: parsePairs(args.rename, "--rename"),
      vertical: args.vertical,
      out: args.out,
    });
    emit(args, result, renderCustomize);
  }),
});
const repair=defineCommand({ meta:{name:"repair",description:"Conservatively repair navigability (missing indexes/log); dry-run by default"}, args:{...common,bundle:{type:"positional",required:true}, dryRun:{type:"boolean",default:true}}, async run({args}){ const bundle=await readOkfBundle(resolve(args.bundle)); const writes=[]; if(!bundle.indexes.some(i=>i.path==="index.md")) writes.push({path:join(args.bundle,"index.md"), body:renderConcept({okf_version:"0.1",type:"Knowledge Bundle",title:"OKF Bundle"},"# Concepts\n")}); if(!bundle.logs.some(l=>l.path==="log.md")) writes.push({path:join(args.bundle,"log.md"), body:"# 2026-07-03\n\n- Initialized OKF log.\n"}); if(!args.dryRun) for(const w of writes) await writeConceptFile(w.path,w.body); emit(args,{dryRun:args.dryRun,writes:writes.map(w=>w.path)},r=>out(JSON.stringify(r,null,2))); }});
export const okf = defineCommand({ meta:{name:"okf",description:"OKF knowledge substrate: compile · customize · audit · quality · enrich · eval · domain-packs · graph · explain · diff · repair"}, subCommands:{audit,quality,"domain-packs":domainPacks,enrich,eval:evalGroup,graph,explain,compile,customize,diff,repair} });
export const __test = { graphFromBundle, auditBundle, explainConcept, coverageFromGraph };
