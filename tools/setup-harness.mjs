import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

console.log("====================================================");
console.log("   GE Agent Factory — Local Harness Setup Wizard   ");
console.log("====================================================\n");

function run(cmd, quiet = false) {
  try {
    return execSync(cmd, { encoding: "utf8", stdio: quiet ? "pipe" : "inherit" }).trim();
  } catch (e) {
    return null;
  }
}

// 1. Verify Python 3
console.log("Checking Python 3...");
const pythonVersion = run("python3 --version", true);
if (!pythonVersion) {
  console.error("❌ Python 3 is not installed. Please install Python 3 and try again.");
  process.exit(1);
}
console.log(`✅ Found: ${pythonVersion}`);

// 2. Verify and install UV
console.log("\nChecking UV (Astral Python Package Manager)...");
let uvVersion = run("uv --version", true);
if (!uvVersion) {
  console.log("⚠️ UV is not installed. Installing UV natively...");
  run("curl -LsSf https://astral.sh/uv/install.sh | sh");
  uvVersion = run("uv --version", true);
  if (!uvVersion) {
    console.error("❌ Failed to install UV. Please install UV manually: https://github.com/astral-sh/uv");
    process.exit(1);
  }
}
console.log(`✅ Found: ${uvVersion}`);

// 3. Verify and install google-agents-cli (Gemini/Claude ADK Harness)
console.log("\nChecking google-agents-cli (AGY/Gemini Harness)...");
let hasAgentsCli = run("google-agents-cli --version", true);
if (!hasAgentsCli) {
  console.log("⚠️ google-agents-cli is missing. Installing globally via UV...");
  run("uv tool install google-agents-cli");
  hasAgentsCli = run("google-agents-cli --version", true);
  if (!hasAgentsCli) {
    console.error("❌ Failed to install google-agents-cli. Please install manually using 'uv tool install google-agents-cli'.");
    process.exit(1);
  }
}
console.log("✅ Installed: google-agents-cli");

// 4. Verify GCP Gcloud CLI
console.log("\nChecking Google Cloud SDK (gcloud)...");
const gcloudVersion = run("gcloud --version", true);
if (!gcloudVersion) {
  console.log("⚠️ Warning: Google Cloud CLI (gcloud) is not installed. Active GCP commands may fail.");
} else {
  console.log("✅ Found: gcloud CLI is configured");
  
  // 5. Verify GCP Project & ADC
  console.log("\nChecking active Google Cloud Project and Application Default Credentials...");
  const activeProject = run("gcloud config get-value project", true);
  if (activeProject) {
    console.log(`👉 Active GCP Project: ${activeProject}`);
  } else {
    console.log("⚠️ Warning: No active GCP project configured in gcloud. Run 'gcloud config set project [YOUR_PROJECT]'.");
  }

  const adcPath = join(
    process.env.HOME || process.env.USERPROFILE || "",
    ".config/gcloud/application_default_credentials.json"
  );
  if (existsSync(adcPath)) {
    console.log("✅ Application Default Credentials (ADC) are active.");
  } else {
    console.log("⚠️ Warning: ADC JSON file was not found. Please authenticate locally:\n   run 'gcloud auth application-default login'");
  }
}

// 6. Complete Setup
console.log("\n====================================================");
console.log("✅ All local harnesses are installed and ready to go!");
console.log("   Start the dev deck by running: bun run dev");
console.log("====================================================\n");
