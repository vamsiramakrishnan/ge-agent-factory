export const $ = (selector, root = document) => root.querySelector(selector);

export function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}

export function compactDetail(data) {
  if (data == null || data === "") return "";
  if (typeof data === "string") return data;
  if (typeof data === "number" || typeof data === "boolean") return String(data);
  const copy = { ...data };
  delete copy.delta;
  delete copy.message;
  delete copy.label;
  const text = JSON.stringify(copy);
  return text === "{}" ? "" : text;
}

export function formatBytes(size) {
  const value = Number(size || 0);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export function formatTime(ms) {
  const value = Number(ms || 0);
  if (!value) return "unknown time";
  return new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatProjectTime(value) {
  if (!value) return "never";
  const stamp = typeof value === "number" ? value : Date.parse(value);
  if (!Number.isFinite(stamp)) return "unknown";
  return formatTime(stamp);
}
