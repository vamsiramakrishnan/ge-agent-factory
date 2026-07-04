// tools/ge/okf.mjs — OKF knowledge substrate commands.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { defineCommand } from "citty";
import pc from "picocolors";
import { readOkfBundle, baseConformance, renderConcept, writeConceptFile } from "../../packages/okf/src/index.mjs";
import { specToOkf } from "../../apps/factory/scripts/spec-to-okf.mjs";
import { okfToSpec } from "../../apps/factory/scripts/okf-to-spec.mjs";
import { compileOkfBundle, toDxError } from "../../packages/okf/src/compile/index.mjs";
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
const audit=defineCommand({ meta:{name:"audit",description:"Audit an OKF bundle across base conformance, navigability, semantics, behavior, and consumption readiness"}, args:{...common, bundle:{type:"positional",required:true}, strict:{type:"boolean"}}, async run({args}){ emit(args, await auditBundle(resolve(args.bundle),{strict:args.strict}), renderAudit); }});
const graph=defineCommand({ meta:{name:"graph",description:"Extract concept authority/relationship graph from an OKF bundle"}, args:{...common, bundle:{type:"positional",required:true}, format:{type:"string",description:"json or cytoscape"}}, async run({args}){ const b=await readOkfBundle(resolve(args.bundle)); emit(args, graphFromBundle(b,{cytoscape:args.format==="cytoscape"}), r=>out(JSON.stringify(r,null,2))); }});
const explain=defineCommand({ meta:{name:"explain",description:"Explain one OKF concept's authority, backlinks, proof, citations, and gaps"}, args:{...common, concept:{type:"positional",required:true}, bundle:{type:"string",description:"OKF bundle directory",default:"okf"}}, async run({args}){ emit(args, await explainConcept(args.concept, resolve(args.bundle)), renderExplain); }});
const compile=defineCommand({ meta:{name:"compile",description:"Compile spec→OKF bundle or OKF bundle→spec (typed compiler with variant resolution)"}, args:{...common, from:{type:"string"}, to:{type:"string"}, spec:{type:"string"}, bundle:{type:"string"}, out:{type:"string",required:true}, all:{type:"boolean",description:"Compile every generated catalog agent spec into an OKF bundle and write audit/graph/coverage sidecars"}, "variant-base":{type:"string",description:"Base bundle directory for a variant bundle (default: sibling directory named after the root's variant_of id)"}}, run: guarded(async ({args})=>{ if(args.all){ const result = await compileAllCatalogSpecs(resolve(args.out)); return emit(args, result, r=>out(`OKF bundles: ${r.generated}/${r.requested} generated · ${r.totalConcepts} concepts · ${r.failed} failed · ${r.out}`)); } if(args.from==="spec"&&args.to==="bundle") return emit(args, await specToOkf({spec:args.spec,out:args.out}), r=>out(`OKF bundle: ${r.bundle} (${r.conceptCount} concepts)`)); if(args.from==="bundle"&&args.to==="spec"){ const variantBase=args["variant-base"]; const result=await compileOkfBundle(resolve(args.bundle),{ baseDir: variantBase ? resolve(variantBase) : undefined }); if(result.errors.length) throw toDxError(result.errors, args.bundle); await writeSpec(args.out,result.spec); return emit(args,{out:args.out},r=>out(`Spec: ${r.out}`)); } throw new Error("usage: ge okf compile --all --out <dir> OR --from spec --to bundle --spec <path> --out <dir> OR --from bundle --to spec --bundle <dir> [--variant-base <dir>] --out <spec.json>"); })});
const diff=defineCommand({ meta:{name:"diff",description:"Machine-readable OKF/spec round-trip diff summary"}, args:{...common,left:{type:"positional",required:true},right:{type:"positional",required:true}}, async run({args}){ const [l,r]=await Promise.all([readFile(args.left,"utf8"),readFile(args.right,"utf8")]); const result={status:l===r?"passed":"warning", preserved:{bytes:{before:l.length,after:r.length}}, changed:l===r?[]:[{field:"file", before:args.left, after:args.right}], lost:[], added:[], unmapped:[]}; emit(args,result,x=>out(JSON.stringify(x,null,2))); }});
const repair=defineCommand({ meta:{name:"repair",description:"Conservatively repair navigability (missing indexes/log); dry-run by default"}, args:{...common,bundle:{type:"positional",required:true}, dryRun:{type:"boolean",default:true}}, async run({args}){ const bundle=await readOkfBundle(resolve(args.bundle)); const writes=[]; if(!bundle.indexes.some(i=>i.path==="index.md")) writes.push({path:join(args.bundle,"index.md"), body:renderConcept({okf_version:"0.1",type:"Knowledge Bundle",title:"OKF Bundle"},"# Concepts\n")}); if(!bundle.logs.some(l=>l.path==="log.md")) writes.push({path:join(args.bundle,"log.md"), body:"# 2026-07-03\n\n- Initialized OKF log.\n"}); if(!args.dryRun) for(const w of writes) await writeConceptFile(w.path,w.body); emit(args,{dryRun:args.dryRun,writes:writes.map(w=>w.path)},r=>out(JSON.stringify(r,null,2))); }});
export const okf = defineCommand({ meta:{name:"okf",description:"OKF knowledge substrate: compile · audit · graph · explain · diff · repair"}, subCommands:{audit,graph,explain,compile,diff,repair} });
export const __test = { graphFromBundle, auditBundle, explainConcept, coverageFromGraph };
