# GitPulse Technical Architecture

This document provides an in-depth breakdown of the internal architecture, component boundaries, message communication protocols, and execution workflows of **GitPulse**.

---

## High-Level System Architecture

GitPulse is built strictly upon the **Google Chrome Manifest V3** specification, enforcing clean separation of privileges, asynchronous service-worker lifecycle, and secure credential handling.

```mermaid
flowchart TD
    subgraph WebpageHost["30accd.xyz (Webpage Runtime)"]
        subgraph MainWorld["MAIN Execution World"]
            PB["content/page-bridge.js"]
            Monaco["Monaco Editor Models\n(window.monaco)"]
            CM["CodeMirror 5 / 6\n(window.CodeMirror)"]
            Ace["Ace Editor\n(window.ace)"]
            DOMFallback["Textarea / ContentEditable"]
            PB -.-> Monaco
            PB -.-> CM
            PB -.-> Ace
            PB -.-> DOMFallback
        end

        subgraph IsolatedWorld["ISOLATED Execution World"]
            CS["content/content.js"]
            DOMEvents["Submit Button Click Listener"]
            MO["DOM MutationObserver\n(Success Dialog Detector)"]
            Toast["On-Screen Toast UI"]
            DOMEvents --> CS
            MO --> CS
            CS --> Toast
        end

        PB <-- "window.postMessage\n(Origin-Checked)" --> CS
    end

    subgraph ExtensionContext["Extension Trusted Context"]
        SW["background/service-worker.js\n(ES Module Service Worker)"]
        Storage[("chrome.storage.local\n(TRUSTED_CONTEXTS)")]
        Popup["popup/popup.html + js\n(Diagnostic & Status Inspector)"]
        Options["options/options.html + js\n(Credential Manager & Settings)"]

        CS -- "chrome.runtime.sendMessage\n(UPLOAD_ACCEPTED_SUBMISSION)" --> SW
        Popup -- "chrome.runtime.sendMessage\n(GET_SETTINGS / VERIFY)" --> SW
        Options -- "chrome.runtime.sendMessage\n(SAVE_SETTINGS / VERIFY)" --> SW
        SW <--> Storage
    end

    subgraph GitHubAPI["GitHub Cloud Services"]
        GH["GitHub REST API v2022-11-28\n(https://api.github.com)"]
        UserRepo[("User Repository\n- Submissions Archive\n- Latest Solution\n- README Dashboards")]
        SW -- "HTTPS / Contents API (PUT / GET)" --> GH
        GH --> UserRepo
    end
```

---

## Execution Environments & Component Roles

### 1. Page Bridge (`content/page-bridge.js`)
- **Execution World**: `MAIN` (Direct in-page execution context).
- **Security Boundary**: Strictly isolated from extension storage and GitHub tokens.
- **Responsibilities**:
  - Direct access to JavaScript runtime global objects (`window.monaco`, `window.CodeMirror`, `window.ace`).
  - Extracting code directly from memory buffers (e.g., `model.getValue()`) rather than relying on brittle HTML text scraping.
  - Analyzing editor languages via Monaco language IDs or language selector dropdowns.
  - Responding to `INSPECT` requests from the isolated content script via window postMessage.

### 2. Isolated Content Script (`content/content.js`)
- **Execution World**: `ISOLATED` (Browser-managed content script context).
- **Responsibilities**:
  - Listening for user click events on challenge submission buttons (`Submit`, `Submit Solution`, `Update Solution`).
  - Enforcing a 1.5-second debounce window to prevent rapid duplicate event triggers.
  - Managing the **Armed Submission State** (120-second validity window).
  - Monitoring DOM mutations via `MutationObserver` targeting newly inserted visible modal dialogs matching both `Solution Updated Successfully!` and `ACCEPTED (n/n Passed)`.
  - Rendering non-intrusive on-screen toast feedback (`__30acc_leethub_toast`).
  - Forwarding accepted submission packages to the background service worker.

### 3. Background Service Worker (`background/service-worker.js`)
- **Execution World**: Service Worker (Extension background context).
- **Responsibilities**:
  - Securing storage with `chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' })`.
  - Storing and retrieving GitHub configuration (owner, repo, PAT, auto-upload toggle, custom adapter rules).
  - Validating GitHub credentials and write permissions (`permissions.push`).
  - Orchestrating the multi-file commit sequence via the GitHub REST API.
  - Merging automated tables into repository READMEs without destroying user-written content.

### 4. Extension UI (`popup/` & `options/`)
- **Popup (`popup/popup.html`)**: Real-time diagnostic tool querying the active tab to inspect editor models, extracted code length, and target button status.
- **Options (`options/options.html`)**: Dedicated credential management UI allowing users to configure repository parameters and test connectivity.

---

## Inter-Component Message Protocol

```mermaid
sequenceDiagram
    autonumber
    actor User as User on 30accd.xyz
    participant PB as page-bridge.js (MAIN)
    participant CS as content.js (ISOLATED)
    participant SW as service-worker.js (BG)
    participant GH as GitHub REST API

    User->>CS: Clicks "Submit" or "Update Solution"
    activate CS
    CS->>PB: window.postMessage({type: 'INSPECT', requestId})
    activate PB
    PB->>PB: Inspects window.monaco / CodeMirror / Ace
    PB-->>CS: window.postMessage({type: 'INSPECT_RESULT', result})
    deactivate PB
    CS->>SW: chrome.runtime.sendMessage({type: 'GET_PUBLIC_SETTINGS'})
    SW-->>CS: {adapter: {...}}
    CS->>CS: Arms submission state (120-second timeout)
    CS->>User: Displays toast: "Submission attempt detected..."
    deactivate CS

    Note over User,CS: Platform tests solution on backend...
    User->>CS: Success modal inserted into DOM
    activate CS
    CS->>CS: MutationObserver detects visible dialog matching ACCEPTED
    CS->>CS: Disarms state & parses test counts (e.g. 1/1 Passed)
    CS->>SW: chrome.runtime.sendMessage({type: 'UPLOAD_ACCEPTED_SUBMISSION', submission})
    deactivate CS
    activate SW
    SW->>SW: Validates payload & checks autoUpload flag
    SW->>GH: PUT /repos/{owner}/{repo}/contents/{archivePath} (Source Archive)
    SW->>GH: PUT /repos/{owner}/{repo}/contents/{jsonPath} (Metadata JSON)
    SW->>GH: PUT /repos/{owner}/{repo}/contents/{day}/solution.ext (Latest Solution)
    SW->>GH: PUT /repos/{owner}/{repo}/contents/{day}/README.md (Day Summary)
    SW->>GH: PUT /repos/{owner}/{repo}/contents/README.md (Progress Dashboard)
    SW-->>CS: {ok: true, uploaded: {...}}
    deactivate SW
    activate CS
    CS->>User: Displays toast: "ACCEPTED submission GitHub par save ho gaya!"
    deactivate CS
```

---

## Submission Detection State Machine

```mermaid
stateDiagram-v2
    [*] --> Idle: Extension Loaded

    Idle --> Armed: Submit Button Clicked & Code Length > 0
    Idle --> Idle: "Run Code" Clicked (Ignored)
    Idle --> Idle: Submit Clicked with Empty Code (Rejected)

    Armed --> Uploading: DOM Mutation Observer Matches Visible ACCEPTED Dialog
    Armed --> Disarmed: 120 Seconds Expired Without Accepted Modal
    Armed --> Disarmed: New Submit Click Overwrites Previous Attempt

    Uploading --> Idle: GitHub Commit Complete (Success Toast)
    Uploading --> Idle: GitHub API Error (Error Toast Displayed)
    Disarmed --> Idle: Reset to Idle
```

---

## GitHub Archival & File Generation Workflow

When an accepted submission is processed, GitPulse executes five coordinated API calls against the GitHub REST API:

```mermaid
flowchart LR
    Sub["Accepted Submission Object\n- Day: 06\n- Code: 'function...' \n- Tests: 1/1\n- Lang: 'javascript'"] --> SW["Service Worker Processor"]

    SW --> F1["1. Archive Code File\nDay-06/submissions/TIMESTAMP-ID.js"]
    SW --> F2["2. Archive Metadata JSON\nDay-06/submissions/TIMESTAMP-ID.json"]
    SW --> F3["3. Latest Solution Code\nDay-06/solution.js"]
    SW --> F4["4. Day Summary README\nDay-06/README.md"]
    SW --> F5["5. Root Progress Table\nREADME.md"]
```

### Managed Markdown Block Algorithm
To avoid overwriting custom documentation created by the user, GitPulse isolates its automated markdown summaries between distinctive HTML comment boundaries:

```html
<!-- 30ACC-LEETHUB:START -->
... Managed Content Auto-Generated by GitPulse ...
<!-- 30ACC-LEETHUB:END -->
```

- When updating `README.md`, GitPulse reads the existing file from GitHub.
- If the markers exist, only the text enclosed between the markers is replaced.
- Any notes, header banners, or custom links written outside the markers remain untouched.

---

## Data Schema: Submission Object

The internal JSON object dispatched from `content.js` to `service-worker.js` conforms to the following schema:

```json
{
  "submissionId": "UUID string (crypto.randomUUID)",
  "day": 6,
  "slug": "dsa-day-06-contains-duplicate-ii",
  "title": "Contains Duplicate II",
  "difficulty": "easy",
  "url": "https://30accd.xyz/dashboard/dsa-day-06-contains-duplicate-ii",
  "pageTitle": "30 Days of Code",
  "language": "javascript",
  "editorType": "monaco",
  "editorConfidence": "api",
  "code": "/* source code */",
  "status": "ACCEPTED",
  "passedTestCases": 1,
  "totalTestCases": 1,
  "passPercentage": 100,
  "submittedAt": "2026-11-08T08:15:22.123Z",
  "runtime": null,
  "memory": null,
  "elapsedTime": null,
  "successEvidence": "fresh post-click success dialog text"
}
```

