import React from "react";
import { motion } from "motion/react";
import {
  Cloud,
  ExternalLink,
  GitBranch,
  Terminal,
  ShieldCheck,
  Boxes,
  Database,
  ListChecks,
  ArrowRight,
} from "lucide-react";

// Repo URL is templated so self-hosted installs and the public demo can point
// the Cloud Shell button at different mirrors. Falls back to the public GitHub
// mirror so the button still works when no env var is set.
const REPO_URL =
  (import.meta.env.VITE_INSTALLER_REPO_URL as string | undefined) ??
  "https://github.com/vamsiramakrishnan/ge-agent-factory";

const cloudShellHref = (() => {
  const params = new URLSearchParams({
    cloudshell_git_repo: REPO_URL,
    cloudshell_workspace: "installer",
    // Path is relative to the repo root (per Cloud Shell docs).
    cloudshell_tutorial: "installer/TUTORIAL.md",
  });
  return `https://shell.cloud.google.com/?${params.toString()}`;
})();

const PROVISIONS = [
  { icon: Boxes, label: "Gateway + Worker", sub: "Cloud Run" },
  { icon: Database, label: "Firestore + Tasks", sub: "state & queue" },
  { icon: GitBranch, label: "Artifact Registry", sub: "container images" },
  { icon: ShieldCheck, label: "Optional IAP", sub: "your auth choice" },
];

const STEPS = [
  { cmd: "terraform apply -var-file=values.tfvars", note: "APIs, SAs, infra" },
  { cmd: "./build-and-deploy.sh", note: "build + deploy containers" },
  { cmd: "./verify.sh", note: "preflight the live gateway" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export const DeployYourOwnSlide = () => (
  <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 relative">
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/[0.05] blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-blue-500/[0.04] blur-[90px]" />
    </div>

    <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      {/* Left: pitch + CTA */}
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/15">
            <Boxes className="w-3 h-3 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/60">
              Install the whole platform
            </span>
          </div>
        </motion.div>

        <motion.h2
          variants={item}
          className="text-4xl sm:text-5xl font-headline font-extrabold mb-5 tracking-tight leading-[1.05]"
        >
          Install the entire Factory in{" "}
          <span className="text-primary">your own project</span>
        </motion.h2>

        <motion.p
          variants={item}
          className="text-base sm:text-lg text-secondary max-w-xl leading-relaxed mb-7"
        >
          This is the <span className="font-semibold text-on-surface">one-time control-plane install</span> —
          not a single agent. The full factory (gateway, worker, queue, and state) lands in{" "}
          <span className="font-semibold text-on-surface">your GCP project</span>{" "}
          in ~15 minutes via a guided Cloud Shell walkthrough — Terraform-managed,
          single-tenant, with IAP if you want it. Once it&apos;s up, deploy individual agents
          straight from their use-case slides.
        </motion.p>

        <motion.div variants={item} className="flex flex-wrap items-center gap-3">
          <a
            href={cloudShellHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl hero-gradient text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
          >
            <Cloud className="w-4 h-4" />
            <span className="text-sm font-headline font-bold">Open in Cloud Shell</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
          <span className="text-[11px] font-mono text-secondary/40">
            needs billing + a Gemini Enterprise app
          </span>
        </motion.div>
      </motion.div>

      {/* Right: what it provisions + command preview */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-5"
      >
        <motion.div variants={item} className="grid grid-cols-2 gap-2.5">
          {PROVISIONS.map((p, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant/15"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-headline font-bold text-on-surface truncate">
                  {p.label}
                </div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-secondary/40">
                  {p.sub}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Terminal-style step preview */}
        <motion.div
          variants={item}
          className="rounded-xl overflow-hidden border border-outline-variant/15 bg-[#0d1117] shadow-xl"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
            <Terminal className="w-3.5 h-3.5 text-secondary/50" />
            <span className="text-[10px] font-mono text-secondary/50">
              installer · three commands
            </span>
            <div className="ml-auto flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="p-4 space-y-3 font-mono text-[11px] sm:text-xs">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-emerald-400/80 select-none">$</span>
                <div className="min-w-0">
                  <div className="text-slate-200 break-all">{s.cmd}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5"># {s.note}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={item}
          className="flex items-center gap-2 text-[11px] text-secondary/50"
        >
          <ListChecks className="w-3.5 h-3.5 text-primary/60" />
          <span>
            The walkthrough pane in Cloud Shell spotlights each step
          </span>
          <ArrowRight className="w-3 h-3 text-secondary/30" />
        </motion.div>
      </motion.div>
    </div>
  </div>
);
