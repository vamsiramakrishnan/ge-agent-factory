export function parseSse(raw) {
  const lines = raw.split("\n");
  const event = lines.find((line) => line.startsWith("event:"))?.slice(6).trim() || "message";
  const id = lines.find((line) => line.startsWith("id:"))?.slice(3).trim() || "";
  const dataLines = lines.filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart());
  if (dataLines.length === 0) return null;
  try {
    return { event, id, data: JSON.parse(dataLines.join("\n")) };
  } catch {
    return { event: "error", id, data: { message: dataLines.join("\n") || "Malformed stream event" } };
  }
}
