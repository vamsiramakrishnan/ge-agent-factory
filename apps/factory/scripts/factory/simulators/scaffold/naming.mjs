export function singularOf(collection) {
  if (collection.endsWith("ies")) return `${collection.slice(0, -3)}y`;
  if (collection.endsWith("sses")) return collection.slice(0, -2);
  if (collection.endsWith("s")) return collection.slice(0, -1);
  return collection;
}

export function titleCaseWords(field) {
  return field
    .replace(/_id$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}
