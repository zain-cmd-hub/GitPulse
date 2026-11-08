# Security Policy

The **GitPulse** maintainers take the security of this project and your personal accounts seriously. This document outlines the security architecture of the extension, our vulnerability reporting process, and recommended security practices for users.

---

## Supported Versions

Only the latest release of GitPulse receives active security updates and vulnerability patches.

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0.0 | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability or credential handling flaw in GitPulse, please report it responsibly:

1. **Do not** open a public GitHub issue.
2. Submit an advisory through [GitHub Security Advisories](https://github.com/zain-cmd-hub/GitPulse/security/advisories) or contact the project maintainer directly via GitHub profile: [zain-cmd-hub](https://github.com/zain-cmd-hub).
3. Include detailed steps to reproduce the issue, proof-of-concept payload (if applicable), and your assessment of the impact.
4. We will acknowledge receipt of your report within 48 hours and work with you on a resolution timeline before public disclosure.

---

## Security Architecture & Design Principles

GitPulse is built from the ground up to protect user credentials and eliminate token leakage into third-party websites.

### 1. Zero-Leak Credential Isolation

```
┌────────────────────────────────────────────────────────┐
│                      Webpage                           │
│  (30accd.xyz / window context / third-party scripts)    │
└──────────────────────────┬─────────────────────────────┘
                           │ (postMessage only, no tokens)
┌──────────────────────────▼─────────────────────────────┐
│              Isolated Content Script                   │
│             (cannot access extension storage)          │
└──────────────────────────┬─────────────────────────────┘
                           │ (chrome.runtime.sendMessage)
┌──────────────────────────▼─────────────────────────────┐
│          Background Service Worker & Options           │
│   - Holds GitHub Personal Access Token (PAT)           │
│   - Access level: TRUSTED_CONTEXTS                     │
│   - Directly communicates with api.github.com          │
└────────────────────────────────────────────────────────┘
```

- **Trusted Context Storage**: GitPulse invokes `chrome.storage.local.setAccessLevel({ accessLevel: 'TRUSTED_CONTEXTS' })`. This Chrome Extension security primitive ensures that content scripts injected into web pages **cannot** read stored secrets from `chrome.storage.local`.
- **Credential Quarantine**: GitHub Personal Access Tokens are entered exclusively within the dedicated extension Options page and read only by the Background Service Worker (`background/service-worker.js`).
- **No Token in Content Scripts**: The content script (`content/content.js`) and page bridge (`content/page-bridge.js`) never receive, request, or handle GitHub tokens.
- **Diagnostic Sanitation**: The popup diagnostic reporting tool specifically strips source code, credentials, and sensitive headers before copying data to the system clipboard.

---

## Required Permissions & Rationale

GitPulse requests only the minimum set of permissions necessary to deliver automated GitHub synchronization:

| Permission | Scope | Justification |
| :--- | :--- | :--- |
| `storage` | Extension Local Storage | Saves GitHub repository metadata, user preferences, and encrypted token reference. |
| `activeTab` | User-Initiated Tab Context | Enables popup diagnostics to safely query the current challenge tab without blanket browsing history access. |
| `notifications` | Chrome Desktop Notifications | Dispatches desktop alerts for successful solution commits or GitHub API errors. |
| `clipboardWrite` | System Clipboard Access | Enables copying sanitized diagnostic reports when troubleshooting editor detection issues. |
| `https://30accd.xyz/*` | Target Site Host Permission | Injects the content script and page bridge to read the code editor buffer and observe submission results. |
| `https://api.github.com/*` | GitHub REST API Host Permission | Allows the background service worker to commit solution files and manage README dashboards. |

---

## Honest Security Limitations & Threat Model

While GitPulse enforces strict browser-level isolation, users must be aware of inherent platform constraints:

1. **Local Disk Profile Storage**:
   Chrome extensions store `chrome.storage.local` data in plaintext or weakly encrypted leveldb files inside your local OS user profile folder (`AppData\Local\Google\Chrome\User Data`). Any process or individual with administrative access to your local computer can read these files.
2. **Token Recommendations**:
   - **Always use a Fine-Grained Personal Access Token (PAT)**.
   - Restrict token access to **Only select repositories** (your dedicated coding challenge repository).
   - Grant the minimum required permission: **Repository permissions -> Contents: Read and write**.
   - **Never** use a Classic PAT with broad `repo` or `admin` scopes.
3. **Token Revocation**:
   If you ever suspect your workstation or browser profile has been compromised, immediately revoke the token at [GitHub Token Settings](https://github.com/settings/tokens).

