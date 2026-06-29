export function parseFlagArgs(argv = [], { bareValue = "true" } = {}) {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith("--")) {
      positional.push(item);
      continue;
    }
    const key = item.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) flags[key] = bareValue;
    else {
      flags[key] = next;
      i += 1;
    }
  }
  return { positional, flags };
}

export function parseCommandArgs(argv = [], defaultCommand = "help", options = {}) {
  const { positional, flags } = parseFlagArgs(argv, options);
  return { command: positional[0] || defaultCommand, flags };
}

export function boolFlag(flags, key, fallback = false) {
  if (!(key in flags)) return fallback;
  const value = flags[key];
  if (value === true) return true;
  if (value === false) return false;
  return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
}
