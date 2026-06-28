let prompt = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  prompt += chunk;
});

process.stdin.on("end", () => {
  const task = prompt.split("# User request").pop()?.trim() || prompt.trim();
  const lines = [
    "Mock Harness Agent online.",
    "",
    "I received the task and would execute it inside the configured workspace.",
    "",
    "Detected mock systems available to the harness:",
    "- BigQuery MCP: local schema and query fixtures",
    "- Maps MCP: deterministic place, route, and geocode fixtures",
    "- Vertex ADK: generated agent-code scaffold target",
    "- GE workspace pipeline: spec-code trace and validation artifacts",
    "- External evidence files: PDF/XLSX-style fixture metadata",
    "",
    "Task excerpt:",
    task.slice(0, 1200),
  ];

  let i = 0;
  const intervalMs = prompt.includes("GE_MOCK_AGENT_SLOW") ? 150 : 35;
  const timer = setInterval(() => {
    if (i >= lines.length) {
      clearInterval(timer);
      process.exit(0);
      return;
    }
    process.stdout.write(`${lines[i++]}\n`);
  }, intervalMs);
});
