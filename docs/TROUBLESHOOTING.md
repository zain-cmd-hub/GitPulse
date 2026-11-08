# GitPulse Troubleshooting Guide

A systematic triage and resolution manual for common issues encountered while using **GitPulse**.

---

## Quick Diagnostic Triage Table

| Error Message or Symptom | Probable Cause | Recommended Resolution |
| :--- | :--- | :--- |
| **"Content script unavailable"** | Page loaded before extension was installed or reloaded. | Refresh the challenge page (`Ctrl + F5` or `Cmd + Shift + R`). |
| **"Editor: Not detected"** | Editor still initializing, embedded in cross-origin iframe, or uses raw textarea. | Wait 3 seconds and rerun diagnostics. If textarea, enable DOM fallback in Settings. |
| **"Language: Not detected"** | Language dropdown has not been set on the webpage. | Manually select your language from the dropdown menu on the challenge page. |
| **"Editor code read nahi hua"** | Editor buffer was empty when Submit was clicked. | Ensure code is entered into the editor before submitting. |
| **"GitHub API error 401"** | Token expired, invalid, or mistyped. | Generate a fresh fine-grained PAT and save it in Settings. |
| **"GitHub API error 403" / "Push permission verified failed"** | Token missing `Contents: Read and write` permission. | Edit token permissions in GitHub Developer Settings; set `Contents` to `Read and write`. |
| **"GitHub API error 404"** | Owner or repository name misspelled, or token lacks access. | Double-check exact username and repository spelling; verify token repository scope. |
| **"Accepted result ka wait ho raha hai..." (Timeout)** | Success dialog took >120s or dialog text did not match. | Verify modal contains `Solution Updated Successfully!` and `ACCEPTED (n/n Passed)`. |

---

## Detailed Issue Guides

### 1. Content Script Unavailable

```text
Symptom: In the GitPulse popup, running diagnostics displays:
"Content script unavailable. Refresh the challenge page after installing the extension."
```

#### Cause:
Chrome extensions only inject content scripts into web pages opened **after** the extension is installed or reloaded. If you already had `30accd.xyz` open before clicking "Load unpacked" or reloading the extension, the page is unaware of the extension.

#### Fix:
1. Switch to the tab where the coding challenge is open.
2. Press `Ctrl + R` (Windows/Linux) or `Cmd + R` (macOS) to reload the page.
3. Open the GitPulse popup and click **Run diagnostics** again.

---

### 2. Editor Not Detected

```text
Symptom: Diagnostics shows "Editor: Not detected", "Code length: 0", or extraction confidence "none".
```

#### Cause:
GitPulse supports Monaco, CodeMirror 5, CodeMirror 6, and Ace Editor. If the editor is not detected:
1. The page may still be asynchronously fetching the editor bundle.
2. The code editor might be rendered inside an `<iframe>` hosted on a different origin (browser same-origin security restricts cross-origin iframe DOM inspection).
3. The platform may be using a standard `<textarea>` or `contenteditable` container.

#### Fix:
1. Wait a few seconds until the editor fully renders with line numbers and syntax highlighting.
2. If the platform is using a plain textarea:
   - Open GitPulse **Settings**.
   - Check **Allow lower-confidence textarea / contenteditable extraction**.
   - Click **Save settings**.
   - Return to the challenge tab and rerun diagnostics.

---

### 3. GitHub Authentication Errors (401, 403, 404)

```text
Symptom: Clicking "Verify GitHub access" displays an error message:
- "GitHub API error 401"
- "Token can read repository but does not have push/write access"
- "GitHub API error 404"
```

#### Cause:
GitHub tokens must be configured with exact repository access and permissions.

#### Fix:
1. **For 401 Unauthorized**:
   Your token is expired or was copied with missing characters. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → generate a new token and update GitPulse Settings.
2. **For 403 Forbidden / No push access**:
   Your token was created without write permissions.
   - Go to your token settings on GitHub.
   - Under **Repository permissions**, ensure **Contents** is set to **Read and write**.
   - Under **Repository access**, ensure your repository is selected.
3. **For 404 Not Found**:
   Verify that:
   - Your **GitHub owner / username** is exact (e.g. `zain-cmd-hub`).
   - Your **Repository name** matches exactly (case-sensitive, e.g. `30-Days-of-Code-2026---ACC`).

---

### 4. Accepted Submission Was Not Uploaded

```text
Symptom: You clicked Submit and the solution passed, but no commit appeared on GitHub.
```

#### Cause:
GitPulse enforces conservative verification to prevent uploading incomplete or failing attempts:
1. **Did you click "Run Code" instead of "Submit"?**
   "Run Code" only runs sample tests and does not submit the challenge. GitPulse only arms when clicking **Submit**, **Submit Solution**, or **Update Solution**.
2. **Did the success dialog match?**
   GitPulse looks for a newly inserted visible element containing:
   - `Solution Updated Successfully!` **AND**
   - `ACCEPTED (n/n Passed)`
3. **Did the acceptance take longer than 2 minutes?**
   The acceptance monitoring window expires after 120 seconds. If the platform backend was congested, the armed state may have timed out.

#### Fix:
If the challenge site updated its success message phrasing:
1. Inspect the modal element on the webpage using Chrome Developer Tools (`F12`).
2. Open GitPulse **Settings**.
3. Set **Optional success-dialog CSS selector** (e.g. `.modal-content` or `[role="dialog"]`).
4. Set **Optional accepted-text regex** to match the new text (e.g. `Accepted`).
5. Click **Save settings**.

---

## How to Export and Share a Diagnostic Report

When reporting an issue or asking for help:

1. Open the problem page on `https://30accd.xyz/dashboard`.
2. Click the **GitPulse** extension icon.
3. Click **Run diagnostics**.
4. Click **Copy report**.
5. GitPulse will copy a safe, sanitized diagnostic JSON payload to your clipboard:

```json
{
  "url": "https://30accd.xyz/dashboard/dsa-day-06-contains-duplicate-ii",
  "slug": "dsa-day-06-contains-duplicate-ii",
  "day": 6,
  "title": "Contains Duplicate II",
  "difficulty": "easy",
  "submitButtonDetected": true,
  "pageTitle": "30 Days of Code",
  "editorDetected": true,
  "editorType": "monaco",
  "editorCount": 1,
  "language": "javascript",
  "codeLength": 245,
  "codeConfidence": "api",
  "timestamp": "2026-11-08T08:15:22.123Z"
}
```

> :lock: **Security Guarantee**: The exported diagnostic report **never** contains your GitHub Personal Access Token, source code, or private browsing data.

6. Paste this JSON snippet into your issue report on [GitHub Issues](https://github.com/zain-cmd-hub/GitPulse/issues).

