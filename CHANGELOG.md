# Changelog

All notable changes to the **GitPulse** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-11-08

### Added
- **Manifest V3 Architecture**: Fully compliant with Chrome Extension Manifest V3 specifications.
- **Dedicated Site Adapter**: Tailored integration for `https://30accd.xyz/*` (specifically `/dashboard` coding challenges).
- **Multi-Engine Editor Inspection**:
  - Monaco Editor deep inspection via page bridge (`window.monaco.editor.getModels`).
  - CodeMirror 5 (`window.CodeMirror`, `.CodeMirror`) and CodeMirror 6 (`.cm-content`, `.cm-editor`).
  - Ace Editor (`window.ace.edit`, `.ace_editor`).
  - Configurable DOM fallback (`<textarea>`, `[contenteditable]`).
- **Language Auto-Detection**: Support for 9 primary programming languages:
  - JavaScript (`.js`), TypeScript (`.ts`), Python (`.py`), C++ (`.cpp`), C (`.c`), C# (`.cs`), Go (`.go`), Java (`.java`), Rust (`.rs`).
- **State-Gated Acceptance Capture**:
  - Arming window (120 seconds) triggered only on explicit submission button clicks.
  - Active DOM `MutationObserver` targeting newly inserted visible dialogs matching `Solution Updated Successfully!` and `ACCEPTED (n/n Passed)`.
  - Rejection of failed submissions, compile errors, and test-only executions ("Run Code").
- **GitHub REST API v2022-11-28 Integration**:
  - Direct communication from the background service worker using `fetch`.
  - SHA-aware contents management (`PUT /repos/{owner}/{repo}/contents/{path}`).
  - Verification endpoint validating repository existence and push/write permissions.
- **Structured Dual-Tier Archival Strategy**:
  - Immutable historical archives: `Day-XX/submissions/<timestamp>-<id>.<ext>`
  - Complete execution metadata: `Day-XX/submissions/<timestamp>-<id>.json`
  - Canonical solution sync: `Day-XX/solution.<ext>`
  - Problem overview summary: `Day-XX/README.md`
  - Automated repository progress dashboard: root `README.md` updated with non-destructive HTML comment markers (`<!-- 30ACC-LEETHUB:START -->`).
- **Interactive UI & Diagnostics**:
  - Popup interface with live connection status, active repository display, and manual verification trigger.
  - One-click Page Diagnostic tool evaluating editor type, model count, extracted code length, confidence tier, and submit button detection.
  - Diagnostic report clipboard exporter (sanitized: code and tokens are excluded).
  - Dedicated Options page for secure configuration of GitHub credentials and custom adapter overrides.
- **Security Hardening**:
  - Access control level set to `TRUSTED_CONTEXTS` on `chrome.storage.local` to isolate tokens from webpage contexts.
  - Page-bridge message isolation with origin verification and unique cryptographic request IDs.

---

## [Unreleased]

### Planned
- Dedicated adapters for additional platforms (LeetCode, HackerRank, CodeChef, Codeforces).
- Dark/Light theme toggle for options and popup panels.
- Configurable folder naming conventions and custom commit message templates.
- Branch selection support for GitHub repository synchronization.

