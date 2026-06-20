export const shellHtml = `<div class="app">

  <!-- ═══ SHARED TOPBAR ═══ -->
  <header class="app-bar">
    <div class="app-bar-start">
      <button class="app-mark" type="button" title="Home">GE</button>
      <button class="app-back" type="button" id="backHomeBtn">←</button>
      <div class="app-titles">
        <strong id="runTitle">Agent Studio</strong>
        <span id="workspaceText" class="app-sub"></span>
      </div>
    </div>
    <div class="app-bar-end">
      <span class="bar-pill daemon-pill"><i class="dot warn" id="daemonDot"></i><span id="daemonState">checking</span></span>
      <span class="bar-pill run-pill"><i class="dot idle" id="runDot"></i><span id="runState">idle</span></span>
      <span class="bar-status" id="streamState"></span>
      <div class="agent-switcher" id="agentSwitcher" hidden>
        <button class="agent-switcher-trigger" type="button" id="agentSwitcherBtn">
          <span class="agent-switcher-name" id="agentSwitcherName">No agent</span>
          <span class="agent-switcher-stage pill" id="agentSwitcherStage">--</span>
          <span class="agent-switcher-chev">&#9662;</span>
        </button>
        <div class="agent-switcher-dropdown" id="agentSwitcherDropdown" hidden>
          <div class="agent-switcher-list" id="agentSwitcherList"></div>
        </div>
      </div>
      <nav class="bar-nav">
        <button class="bar-link" type="button" data-nav="builder">Builder</button>
        <button class="bar-link" type="button" data-nav="workspace">Workspace</button>
      </nav>
      <button class="bar-icon" type="button" id="settingsBtn" title="Settings">⚙</button>
      <button class="bar-icon" type="button" id="refreshBtn" title="Refresh">↻</button>
      <button class="bar-icon" type="button" id="clearBtn" title="Clear">⌫</button>
      <button class="btn danger btn-sm" type="button" id="cancelBtn" disabled>Cancel</button>
    </div>
  </header>

  <!-- ═══ SCREEN: HOME ═══ -->
  <div class="screen screen-home">
    <div class="screen-body">
      <div class="home-hero">
        <span class="home-kicker">GE Agent Studio</span>
        <h2 class="home-title">Build one agent at a time.</h2>
        <p class="home-sub">Transform real use cases into local ADK workspaces with mocked systems and auditable run trails.</p>
        <div class="home-hero-actions">
          <button class="btn primary btn-lg" id="homeCreateBtn" type="button">+ New Agent</button>
          <button class="btn btn-lg" id="homeResumeBtn" type="button">Open Latest</button>
        </div>
      </div>

      <div class="setup-card" id="setupCard">
        <div class="setup-card-head">
          <strong>Cloud Setup</strong>
          <span class="pill" id="setupStatusPill">checking</span>
        </div>
        <div class="setup-card-body" id="setupCardBody">
          <div class="setup-row">
            <span class="setup-label">Account</span>
            <span class="setup-value" id="setupAccount">—</span>
            <span class="setup-dot" id="setupAccountDot"></span>
          </div>
          <div class="setup-row">
            <span class="setup-label">ADC</span>
            <span class="setup-value" id="setupAdc">—</span>
            <span class="setup-dot" id="setupAdcDot"></span>
          </div>
          <div class="setup-row">
            <span class="setup-label">Project</span>
            <div class="setup-input-wrap">
              <input class="setup-input" id="setupProjectInput" placeholder="my-gcp-project-id" spellcheck="false">
              <button class="btn btn-sm" id="setupValidateProject" type="button">Validate</button>
            </div>
            <span class="setup-dot" id="setupProjectDot"></span>
          </div>
          <div class="setup-row">
            <span class="setup-label">Deploy Region</span>
            <select class="setup-select" id="setupDeployRegion">
              <option value="global">global</option>
              <option value="us-central1">us-central1</option>
              <option value="us-east1">us-east1</option>
              <option value="us-west1">us-west1</option>
              <option value="europe-west1">europe-west1</option>
              <option value="europe-west4">europe-west4</option>
              <option value="asia-east1">asia-east1</option>
              <option value="asia-northeast1">asia-northeast1</option>
            </select>
          </div>
          <div class="setup-row">
            <span class="setup-label">GE Location</span>
            <select class="setup-select" id="setupGeLocation">
              <option value="global">global</option>
              <option value="us">us</option>
              <option value="eu">eu</option>
            </select>
          </div>
          <div class="setup-row setup-row-app">
            <span class="setup-label">GE App</span>
            <div class="setup-app-wrap">
              <select class="setup-select" id="setupGeApp"><option value="">Select project first</option></select>
              <button class="btn btn-sm" id="setupLoadApps" type="button">Load</button>
            </div>
          </div>
          <div class="setup-actions">
            <button class="btn primary" id="setupSaveBtn" type="button">Save Configuration</button>
          </div>
          <div class="setup-hint" id="setupHint"></div>
        </div>
      </div>

      <div class="home-current-card" id="homeCurrent">
        <span id="homeDaemonState">checking</span>
        <strong>No workspace open</strong>
      </div>

      <div class="home-stats">
        <div class="home-stat"><strong id="homeWorkspaceCount">0</strong><span>Workspaces</span></div>
        <div class="home-stat"><strong id="homeUseCaseCount">0</strong><span>Use Cases</span></div>
        <div class="home-stat"><strong id="homeAgentCount">0</strong><span>Agents</span></div>
        <div class="home-stat"><strong id="homeSystemCount">0</strong><span>Systems</span></div>
        <div class="home-stat"><strong id="homeSkillCount">0</strong><span>Skills</span></div>
      </div>

      <section class="home-section">
        <div class="home-section-head">
          <h3>Workspaces</h3>
          <span class="pill" id="homeWorkspacePill">0</span>
        </div>
        <div class="home-workspace-grid" id="homeWorkspaces"></div>
        <div class="home-create-form">
          <input id="projectName" placeholder="New workspace name" class="home-input">
          <button class="btn primary" id="createProjectBtn" type="button">Create</button>
        </div>
      </section>

      <section class="home-section">
        <div class="home-section-head">
          <h3>Featured Use Cases</h3>
          <span class="pill" id="homeUseCasePill">0</span>
        </div>
        <div class="home-usecase-list" id="homeUseCases"></div>
      </section>

      <div class="home-actions" id="homeNextActions"></div>
    </div>
  </div>

  <!-- ═══ SCREEN: BUILDER ═══ -->
  <div class="screen screen-builder">
    <div class="screen-body screen-narrow">
      <div class="builder-header">
        <span class="builder-state" id="builderState">Choose a department and use case, then generate.</span>
      </div>

      <div class="builder-stepper" role="tablist">
        <button class="builder-step active" type="button" data-builder-step="source">
          <span>1</span><strong>Source</strong><em id="builderSourceSummary">Choose use case</em>
        </button>
        <button class="builder-step" type="button" data-builder-step="interview">
          <span>2</span><strong>Interview</strong><em id="builderInterviewSummary">0 answered</em>
        </button>
        <button class="builder-step" type="button" data-builder-step="review">
          <span>3</span><strong>Review</strong><em id="builderReviewSummary">Brief ready</em>
        </button>
      </div>

      <!-- Stage: Source -->
      <div class="builder-stage" data-builder-stage="source">
        <div class="builder-stage-head">
          <div>
            <span class="builder-label">Department & Use Case</span>
            <h2>Pick the demo spine</h2>
            <p>Choose the one workflow the generated agent should dramatize.</p>
          </div>
          <span class="pill" id="useCaseCountPill">0 use cases</span>
        </div>
        <div class="section-title"><span>Department</span><span class="pill" id="departmentCount">0</span></div>
        <div class="dept-grid" id="departments"></div>
        <div class="builder-source-layout">
          <div class="usecase-list" id="useCases"></div>
          <div class="selected-usecase-card" id="selectedUseCaseSummary">
            <span>Selected use case</span>
            <strong>None selected</strong>
            <p>Choose a use case to continue.</p>
          </div>
        </div>
        <div class="builder-actions end">
          <button class="btn primary" type="button" id="builderToInterviewBtn">Continue to Interview →</button>
        </div>
      </div>

      <!-- Stage: Interview -->
      <div class="builder-stage" data-builder-stage="interview">
        <div class="builder-stage-head">
          <div>
            <span class="builder-label">Stakeholder Interview</span>
            <h2>Add only the missing context</h2>
            <p>Three specific answers are enough. Leave defaults when the source slide already gives the signal.</p>
          </div>
          <span class="pill" id="interviewProgressPill">0/5 answered</span>
        </div>
        <div class="question-list" id="interviewQuestions"></div>
        <div class="builder-actions split">
          <button class="btn ghost" type="button" id="builderBackToSourceBtn">← Back</button>
          <button class="btn primary" type="button" id="builderToReviewBtn">Review Brief →</button>
        </div>
      </div>

      <!-- Stage: Review -->
      <div class="builder-stage" data-builder-stage="review">
        <div class="builder-stage-head">
          <div>
            <span class="builder-label">Generated Brief</span>
            <h2>Run the workspace brief</h2>
            <p>This prompt carries department, persona, systems, KPIs, and local-only ADK constraints.</p>
          </div>
          <span class="pill" id="reviewReadinessPill">Ready</span>
        </div>
        <details class="brief-disclosure" open>
          <summary>Generated prompt</summary>
          <div class="brief-box" id="briefPreview"></div>
        </details>
        <div class="builder-actions split">
          <button class="btn ghost" type="button" id="builderBackToInterviewBtn">← Back</button>
          <div>
            <button class="btn" type="button" id="copyBriefBtn">Copy to Clipboard</button>
            <button class="btn primary btn-lg" type="button" id="runBriefBtn">▶ Run This Brief</button>
          </div>
        </div>
      </div>

      <span class="pill builder-progress-pill" id="builderProgressPill">Source</span>
    </div>
  </div>

  <!-- ═══ SCREEN: WORKSPACE (split pane: chat + context) ═══ -->
  <div class="screen screen-workspace">
    <!-- LEFT PANE: Chat -->
    <div class="ws-left">
      <div class="chat-header">
        <div class="chat-header-title">
          <span id="chatSessionPill">Chat</span>
        </div>
        <div class="chat-header-actions">
          <button class="bar-icon" type="button" id="chatHistoryBtn" title="Conversations">☰</button>
          <button class="bar-icon" type="button" id="newChatBtn" title="New chat">+</button>
        </div>
        <div class="chat-history-dropdown" id="chatHistoryList" hidden>
          <div class="chat-history-head"><strong>Conversations</strong><button class="btn btn-sm" type="button" id="newChatBtn2">+ New</button></div>
          <div class="chat-history-items"></div>
        </div>
      </div>
      <div class="chat-layout">
        <div class="chat-scroll">
          <div id="transcript">
            <div class="empty"><div><strong>Ready to run.</strong><p class="subtle">Send a prompt or use the Builder to generate one.</p></div></div>
          </div>
        </div>
        <aside class="chat-timeline">
          <div class="timeline-header">
            <strong>Timeline</strong>
            <span class="pill" id="eventCountPill">0</span>
          </div>
          <div class="metric-grid">
            <div class="metric"><span>Status</span><strong id="statusMetric">idle</strong></div>
            <div class="metric"><span>Runtime</span><strong id="runtimeMetric">0s</strong></div>
          </div>
          <span class="timeline-run-id" id="runIdText">No run yet</span>
          <div class="timeline" id="timeline"></div>
        </aside>
      </div>
      <form class="composer" id="chatForm">
        <div class="composer-inner">
          <div class="example-row" id="examples"></div>
          <div class="composer-box">
            <textarea id="message" placeholder="Send a prompt to the agent..."></textarea>
            <div class="send-col">
              <button class="send" id="send" type="submit">Send</button>
              <span class="hint">⏎ send · ⇧⏎ newline</span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- RESIZER -->
    <div class="ws-resizer" id="wsResizer" title="Drag to resize panes"></div>

    <!-- RIGHT PANE: Adaptive Dashboard -->
    <div class="ws-right">
      <div class="ws-dashboard" id="wsDashboard">
        <!-- Dashboard content rendered dynamically by workspace-dashboard.js -->
      </div>
    </div>
  </div>

  <!-- ═══ HIDDEN DATA ELEMENTS ═══ -->
  <div hidden>
    <div id="projects"></div>
    <span id="selectedProjectPill"></span>
    <span id="agentCount">0</span>
    <span id="systemCount">0</span>
    <div id="methodSteps">
      <div class="method-step" data-step="department"></div>
      <div class="method-step" data-step="interview"></div>
      <div class="method-step" data-step="workspace"></div>
      <div class="method-step" data-step="iterate"></div>
    </div>
    <span id="methodDepartment"></span>
    <span id="methodUseCase"></span>
    <span id="methodWorkspace"></span>
    <span id="methodAgent"></span>
    <span id="readinessPill"></span>
    <div id="readinessList"></div>
    <div id="nextActions"></div>
    <div id="sideExamples"></div>
    <div id="sidebarSettingsBtn"></div>
  </div>

</div>

<!-- ═══ NEW AGENT MODAL ═══ -->
<div class="modal-backdrop" id="newAgentModal" hidden>
  <section class="new-agent-modal" role="dialog" aria-modal="true" aria-labelledby="newAgentTitle">
    <div class="new-agent-head">
      <div>
        <span class="eyebrow">Create</span>
        <h2 id="newAgentTitle">New Agent</h2>
      </div>
      <button class="btn ghost" id="closeNewAgentBtn" type="button">Close</button>
    </div>
    <div class="new-agent-body">

      <div class="new-agent-workspace-row">
        <label class="new-agent-label">Target Workspace</label>
        <select class="select new-agent-select" id="newAgentWorkspaceSelect"></select>
      </div>
      <div class="inline-ws-create" id="inlineWsCreate" hidden>
        <span class="inline-ws-label">No workspaces yet &mdash; create one:</span>
        <div class="inline-ws-form">
          <input class="home-input inline-ws-input" id="inlineWsName" placeholder="Workspace name">
          <button class="btn primary" id="inlineWsBtn" type="button">Create</button>
        </div>
      </div>

      <div class="new-agent-paths">
        <button class="agent-path-card active" type="button" data-agent-path="usecase">
          <span class="agent-path-icon">UC</span>
          <strong>From Use Case</strong>
          <span>Pick a department and use case from the catalog.</span>
        </button>
        <button class="agent-path-card" type="button" data-agent-path="department">
          <span class="agent-path-icon">DP</span>
          <strong>From Department</strong>
          <span>Choose a department, describe the agent yourself.</span>
        </button>
        <button class="agent-path-card" type="button" data-agent-path="freeform">
          <span class="agent-path-icon">FF</span>
          <strong>Freeform</strong>
          <span>Start from scratch with just a name and description.</span>
        </button>
      </div>

      <!-- Path: From Use Case -->
      <div class="new-agent-form" data-agent-form="usecase">
        <div class="new-agent-field">
          <label class="new-agent-label">Department</label>
          <div class="new-agent-dept-pills" id="newAgentDeptPills"></div>
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Domain</label>
          <div class="new-agent-domain-nav" id="newAgentDomainNav"></div>
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Use Case</label>
          <div class="new-agent-usecase-grid" id="newAgentUseCaseGrid"></div>
          <select class="select new-agent-select" id="newAgentUseCaseSelect" hidden></select>
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Agent Name</label>
          <input class="home-input new-agent-input" id="newAgentNameUC" placeholder="e.g. Onboarding Coordinator">
        </div>
        <button class="btn primary btn-lg new-agent-submit" id="createAgentUseCaseBtn" type="button">Create Agent</button>
      </div>

      <!-- Path: From Department -->
      <div class="new-agent-form" data-agent-form="department" hidden>
        <div class="new-agent-field">
          <label class="new-agent-label">Department</label>
          <div class="new-agent-dept-pills" id="newAgentDeptPillsDept"></div>
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Agent Name</label>
          <input class="home-input new-agent-input" id="newAgentNameDept" placeholder="e.g. Benefits Advisor">
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Description</label>
          <textarea class="home-input new-agent-textarea" id="newAgentDescDept" placeholder="What should this agent do?" rows="3"></textarea>
        </div>
        <button class="btn primary btn-lg new-agent-submit" id="createAgentDeptBtn" type="button">Create Agent</button>
      </div>

      <!-- Path: Freeform -->
      <div class="new-agent-form" data-agent-form="freeform" hidden>
        <div class="new-agent-field">
          <label class="new-agent-label">Agent Name</label>
          <input class="home-input new-agent-input" id="newAgentNameFree" placeholder="e.g. Custom Workflow Agent">
        </div>
        <div class="new-agent-field">
          <label class="new-agent-label">Description</label>
          <textarea class="home-input new-agent-textarea" id="newAgentDescFree" placeholder="Describe what this agent should do..." rows="3"></textarea>
        </div>
        <button class="btn primary btn-lg new-agent-submit" id="createAgentFreeBtn" type="button">Create Agent</button>
      </div>
    </div>
  </section>
</div>

<!-- ═══ SETTINGS MODAL ═══ -->
<div class="modal-backdrop" id="settingsModal" hidden>
  <section class="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <div class="settings-head">
      <div>
        <span class="eyebrow">Settings</span>
        <h2 id="settingsTitle">Runtime & Registry</h2>
      </div>
      <button class="btn ghost" id="closeSettingsBtn" type="button">Close</button>
    </div>
    <div class="settings-body">
      <section class="settings-section">
        <div class="section-title"><span>Agent runtime</span><span class="pill" id="selectedAgentPill">gemini</span></div>
        <div class="agent-list" id="agents"></div>
      </section>
      <section class="settings-section">
        <div class="section-title"><span>Model</span><span class="pill">per-agent</span></div>
        <select class="select settings-select" id="modelSelect"></select>
      </section>
      <section class="settings-section">
        <div class="section-title"><span>System registry</span><span class="pill">mock-aware</span></div>
        <div class="system-list" id="systems"></div>
      </section>
    </div>
  </section>
</div>`;
