# Contributing to GitPulse

Thank you for your interest in contributing to **GitPulse**! GitPulse is an open-source Chrome extension that automatically archives accepted coding challenge solutions directly to GitHub.

We welcome bug reports, adapter improvements, documentation enhancements, and feature proposals.

---

## Code of Conduct

By participating in this project, you agree to foster an open, welcoming, and harassment-free environment for all contributors. Please be respectful and constructive in all discussions, issues, and pull requests.

---

## Development Setup

GitPulse is built using modern Manifest V3 standards with vanilla JavaScript and standard Web APIs. No complex build pipelines or bundlers are required.

### Prerequisites

- **Google Chrome** (v88 or newer) or any Chromium-compatible browser (Edge, Brave, Arc, Opera)
- **Node.js** (v18.x or newer) for executing unit tests
- **Git** installed on your system

### Local Setup Steps

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/zain-cmd-hub/GitPulse.git
   cd GitPulse
   ```

2. **Run Existing Tests**:
   Ensure all baseline tests pass before making modifications:
   ```bash
   npm test
   ```

3. **Load the Unpacked Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`.
   - Enable the **Developer mode** toggle in the top-right corner.
   - Click **Load unpacked** in the top-left corner.
   - Select the root `GitPulse` folder (the directory containing `manifest.json`).

4. **Test Live Reloading**:
   - Make your desired changes in `content/`, `background/`, `popup/`, or `options/`.
   - On the `chrome://extensions/` page, click the circular **Reload** icon on the GitPulse card.
   - Refresh any open challenge tab on `https://30accd.xyz/*` to load the updated content scripts.

---

## Architectural Guidelines

When contributing code, please respect GitPulse's established architectural boundaries:

1. **Manifest V3 Separation of Concerns**:
   - **`content/page-bridge.js` (MAIN world)**: Has access to in-page window objects (`window.monaco`, `window.CodeMirror`, `window.ace`). Never pass credentials or sensitive data to this script.
   - **`content/content.js` (ISOLATED world)**: Interacts with the DOM, monitors mutations, and handles event listeners. Communicates with `page-bridge.js` using `window.postMessage` and with `service-worker.js` via `chrome.runtime.sendMessage`.
   - **`background/service-worker.js` (Trusted Background Context)**: Handles all GitHub REST API communication and credential storage (`chrome.storage.local`).
2. **Zero Inlined Tokens**:
   - Never pass tokens across window messages.
   - Use `TRUSTED_CONTEXTS` for storage access.
3. **No Unnecessary External Dependencies**:
   - GitPulse aims to remain lightweight, fast, and secure. Avoid introducing large npm runtime dependencies or heavy transpilation toolchains unless strictly justified.

---

## Testing Your Changes

Before submitting a Pull Request, complete this checklist:

1. **Run Automated Tests**:
   ```bash
   npm test
   ```
2. **Verify Syntax & Formatting**:
   Ensure JavaScript files have no syntax errors and maintain clean, readable formatting.
3. **Manual Validation Workflow**:
   - Open the GitPulse popup and verify UI rendering.
   - Open GitPulse Settings and test saving valid/invalid credentials.
   - Click **Verify GitHub access** to confirm API authentication.
   - Open a challenge on `https://30accd.xyz/dashboard` and click **Run diagnostics** in the popup.
   - Verify editor detection, language identification, and code length.
   - Test a submission run: confirm failed runs do not trigger commits, and verified accepted solutions trigger proper commits.

---

## Submitting Pull Requests

1. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Commit Your Changes**:
   Write clear, concise commit messages following standard conventions:
   ```bash
   git commit -m "feat(adapter): add syntax support for Rust in CodeMirror 6"
   git commit -m "fix(worker): handle empty repository edge case during verification"
   ```

3. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request**:
   - Provide a clear summary of your changes.
   - Reference any related issues (e.g., `Closes #12`).
   - Include before-and-after screenshots for any UI adjustments.

---

## Adding New Platform Adapters (Roadmap)

If you are interested in extending GitPulse to support additional platforms (such as LeetCode or HackerRank):
- Please open an issue to discuss the design before submitting a large PR.
- Ensure new platform adapters are modular and do not break the existing `30accd.xyz` adapter.
- Document any platform-specific quirks, success dialog patterns, and editor DOM structures.

