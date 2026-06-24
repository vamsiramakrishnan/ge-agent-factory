import { classifyReadinessCheck, classifyReadinessSection } from "./config-schema.mjs";

export function createCheckCollector() {
  const checks = [];
  return {
    checks,
    add(name, status, detail, fix = null) {
      checks.push({ name, status, detail, fix: fix || null });
    },
    report(extra = {}) {
      return { ...extra, checks, fails: checks.filter((check) => check.status === "fail").length };
    },
  };
}

export function classifyDoctorCheck(section, check) {
  return classifyReadinessCheck(section, check);
}

export function classifyDoctorSection(section) {
  return classifyReadinessSection(section);
}

export function runDoctorSection(name, fn) {
  try {
    const report = fn();
    return classifyDoctorSection({
      name,
      checks: report.checks || [],
      fails: report.fails || 0,
    });
  } catch (error) {
    return classifyDoctorSection({
      name,
      checks: [{ name, status: "fail", detail: error.message || String(error), fix: null }],
      fails: 1,
    });
  }
}

export function buildDoctorReport({ cfg = {}, sections = [] } = {}) {
  const fails = sections.reduce((count, section) => count + (section.fails || 0), 0);
  const repairPlan = sections.flatMap((section) => (
    section.repairPlan || []
  ).map((item) => ({ section: section.name, ...item })));
  return {
    mode: "all",
    project: cfg.project,
    region: cfg.region,
    sections,
    fails,
    repairPlan,
  };
}
