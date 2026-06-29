/**
 * Setup controller — manages the Cloud Setup card on the landing page.
 *
 * Checks auth status, loads GCP projects, loads Gemini Enterprise apps,
 * and saves .env configuration.
 */
import { fetchAuthStatus, setGcpProject, fetchGeminiApps, saveEnvConfig } from "../lib/api.js";

export function createSetupController(el) {
  async function loadStatus() {
    normalizeRegionOptions();
    try {
      const { auth, env } = await fetchAuthStatus();

      // Account
      el.setupAccount.textContent = auth.account || "Not logged in";
      el.setupAccountDot.className = `setup-dot ${auth.account ? "on" : "off"}`;

      // ADC
      el.setupAdc.textContent = auth.adcValid ? "Valid" : "Not configured";
      el.setupAdcDot.className = `setup-dot ${auth.adcValid ? "on" : "off"}`;

      // Project
      const projectId = env.GOOGLE_CLOUD_PROJECT || auth.project;
      el.setupProjectDot.className = `setup-dot ${projectId ? "on" : "off"}`;
      if (projectId && !el.setupProjectInput.value) el.setupProjectInput.value = projectId;

      // Status pill
      el.setupStatusPill.textContent = auth.ready ? "ready" : "setup needed";
      el.setupStatusPill.className = `pill ${auth.ready ? "setup-pill-ok" : "setup-pill-warn"}`;

      // Set region/location from env
      const deployLocation = env.GOOGLE_CLOUD_LOCATION || env.GOOGLE_GENAI_LOCATION;
      if (deployLocation) ensureOption(el.setupDeployRegion, deployLocation);
      else if (el.setupDeployRegion && !el.setupDeployRegion.value) el.setupDeployRegion.value = "global";
      if (env.GEMINI_ENTERPRISE_LOCATION) ensureOption(el.setupGeLocation, env.GEMINI_ENTERPRISE_LOCATION);
      else if (el.setupGeLocation && !el.setupGeLocation.value) el.setupGeLocation.value = "global";

      // Hint
      if (!auth.account) {
        el.setupHint.textContent = "Run: gcloud auth login && gcloud auth application-default login";
      } else if (!auth.adcValid) {
        el.setupHint.textContent = "Run: gcloud auth application-default login";
      } else if (!auth.project) {
        el.setupHint.textContent = "Select a GCP project above.";
      } else {
        el.setupHint.textContent = "";
      }
    } catch (e) {
      el.setupStatusPill.textContent = "offline";
      el.setupHint.textContent = "Could not check auth status. Is the daemon running?";
    }
  }

  async function validateProject() {
    const projectId = el.setupProjectInput.value.trim();
    if (!projectId) {
      el.setupProjectDot.className = "setup-dot off";
      el.setupHint.textContent = "Enter a GCP project ID.";
      return;
    }
    el.setupHint.textContent = "Validating project...";
    try {
      const ok = await setGcpProject(projectId);
      el.setupProjectDot.className = `setup-dot ${ok ? "on" : "off"}`;
      el.setupHint.textContent = ok ? `Project ${projectId} set.` : `Could not set project ${projectId}.`;
      if (ok) el.setupGeApp.innerHTML = "<option value=''>Click Load to fetch apps</option>";
    } catch (e) {
      el.setupProjectDot.className = "setup-dot off";
      el.setupHint.textContent = `Invalid project: ${e.message}`;
    }
  }

  async function loadGeminiApps() {
    const projectId = el.setupProjectInput.value.trim();
    if (!projectId) return;
    el.setupGeApp.innerHTML = "<option value=''>Loading...</option>";
    try {
      const { apps } = await fetchGeminiApps(projectId);
      el.setupGeApp.innerHTML = "";
      if (apps.length === 0) {
        el.setupGeApp.innerHTML = "<option value=''>No apps found</option>";
        return;
      }
      const none = document.createElement("option");
      none.value = "";
      none.textContent = "Select an app...";
      el.setupGeApp.appendChild(none);
      for (const app of apps) {
        const opt = document.createElement("option");
        opt.value = app.appId || app.displayName;
        opt.textContent = `${app.displayName} (${app.location})`;
        el.setupGeApp.appendChild(opt);
      }
    } catch {
      el.setupGeApp.innerHTML = "<option value=''>Failed to load</option>";
    }
  }

  async function saveConfig() {
    const deployLocation = el.setupDeployRegion.value || "global";
    const config = {
      GOOGLE_CLOUD_PROJECT: el.setupProjectInput.value.trim(),
      GOOGLE_CLOUD_LOCATION: deployLocation,
      GEMINI_ENTERPRISE_LOCATION: el.setupGeLocation.value,
      GEMINI_ENTERPRISE_APP_ID: el.setupGeApp.value,
      GOOGLE_GENAI_USE_VERTEXAI: "1",
      GOOGLE_GENAI_LOCATION: deployLocation,
    };

    // Also set gcloud project
    if (config.GOOGLE_CLOUD_PROJECT) {
      await setGcpProject(config.GOOGLE_CLOUD_PROJECT);
    }

    try {
      await saveEnvConfig(config);
      el.setupHint.textContent = "Configuration saved to .env";
      el.setupHint.className = "setup-hint setup-hint-ok";
      setTimeout(() => { el.setupHint.className = "setup-hint"; }, 3000);
    } catch (e) {
      el.setupHint.textContent = `Save failed: ${e.message}`;
    }
  }

  function ensureOption(select, value) {
    if (!select || !value) return;
    if (![...select.options].some((option) => option.value === value)) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      if (value === "global" && select.firstChild) select.insertBefore(option, select.firstChild);
      else select.appendChild(option);
    }
    select.value = value;
  }

  function normalizeRegionOptions() {
    ensureOption(el.setupDeployRegion, "global");
    ensureOption(el.setupGeLocation, "global");
  }

  function bind() {
    normalizeRegionOptions();
    el.setupLoadApps?.addEventListener("click", loadGeminiApps);
    el.setupSaveBtn?.addEventListener("click", saveConfig);
    el.setupValidateProject?.addEventListener("click", validateProject);
    el.setupProjectInput?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); validateProject(); }
    });
  }

  return { loadStatus, loadGeminiApps, saveConfig, bind };
}
