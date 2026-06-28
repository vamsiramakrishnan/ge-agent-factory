import { snakeCase } from "../core/naming.mjs";

export const DEPARTMENT_PACKS = [
  { id: "dept_hr", department: "hr", title: "HR", layer: "department" },
  { id: "dept_marketing", department: "marketing", title: "Marketing", layer: "department" },
  { id: "dept_procurement", department: "procurement", title: "Procurement", layer: "department" },
  { id: "dept_it", department: "it", title: "IT", layer: "department" },
  { id: "dept_finance", department: "finance", title: "Finance", layer: "department" },
];

export function domainPacksFromCatalog(domainCatalog = []) {
  return domainCatalog.map((domain) => ({
    id: `domain_${snakeCase(domain.department)}_${snakeCase(domain.slug || domain.title || domain.id)}`,
    layer: "domain",
    department: domain.department,
    domainId: domain.id,
    domainNumber: domain.domainNumber,
    title: domain.title,
    slug: domain.slug,
    useCaseCount: domain.useCaseCount || domain.useCases?.length || 0,
    description: domain.description || "",
  }));
}

export function domainNumberFromUseCase(useCase) {
  const match = String(useCase?.domainId || "").match(/domain-(\d+)/);
  return match ? Number(match[1]) : null;
}

export function departmentPackForUseCase(useCase) {
  return DEPARTMENT_PACKS.find((pack) => pack.department === useCase?.department) || null;
}

export function domainPackForUseCase(useCase, domainCatalog = []) {
  const domainNumber = domainNumberFromUseCase(useCase);
  const domain = domainCatalog.find((item) => item.domainNumber === domainNumber && item.department === useCase?.department)
    || domainCatalog.find((item) => item.domainNumber === domainNumber)
    || null;
  if (!domain) return null;
  return domainPacksFromCatalog([domain])[0] || null;
}
