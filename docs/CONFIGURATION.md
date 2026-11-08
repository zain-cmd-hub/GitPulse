# GitPulse Configuration Guide

This guide walks you through setting up your GitHub repository, generating a secure fine-grained Personal Access Token (PAT), and configuring the **GitPulse** extension settings.

---

## Overview of Configuration Flow

```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│ 1. Create Target Repo   │ ───► │ 2. Generate Scoped PAT  │ ───► │ 3. Configure GitPulse   │
│    (Public or Private)  │      │    (Contents: Read/Write│      │    Settings Page        │
└─────────────────────────┘      └─────────────────────────┘      └────────────┬────────────┘
                                                                               │
                                                                  ┌────────────▼────────────┐
                                                                  │ 4. Click "Verify Access"│
                                                                  │    (Confirms push auth) │
                                                                  └─────────────────────────┘
```

---

## Step 1: Create a GitHub Target Repository

1. Log in to [GitHub](https://github.com/).
2. In the top-right corner, click **+** → **New repository** (or visit [https://github.com/new](https://github.com/new)).
3. Fill in the repository details:
   - **Repository name**: e.g., `30-Days-of-Code-2026---ACC` or `coding-challenges`
   - **Visibility**: Choose **Public** or **Private** (both are fully supported)
   - **Initialize repository with**: Check **Add a README file** (optional, GitPulse handles both empty and initialized repositories)
4. Click **Create repository**.
5. Note down your **GitHub username** (owner) and your **Repository name**.

---

## Step 2: Generate a Fine-Grained Personal Access Token (PAT)

GitPulse requires access to the GitHub Contents API to create and update files. For maximum security, always use GitHub's **Fine-Grained Personal Access Tokens**, which restrict access to only your selected repository.

### Step-by-Step Token Creation

1. In GitHub, click your **Profile Picture** (top-right) → **Settings**.
2. In the left navigation menu, scroll down and click **Developer settings** (at the very bottom).
3. Under **Personal access tokens**, click **Fine-grained tokens**.
   - Direct link: [https://github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta)
4. Click **Generate new token**.
5. Configure the token fields:
   - **Token name**: `GitPulse-Sync`
   - **Expiration**: Select a validity period (e.g., `90 days` or custom).
   - **Description**: `Automated coding submission synchronization for GitPulse extension.`
6. **Repository access**:
   - Select **Only select repositories**.
   - From the repository dropdown, search for and select the repository you created in Step 1 (e.g., `30-Days-of-Code-2026---ACC`).
7. **Repository permissions**:
   - Scroll down to the **Repository permissions** section.
   - Locate the **Contents** permission row.
   - Click the dropdown and select **Access: Read and write**.
   - *(Note: GitHub automatically grants `Metadata: Read-only` which is required for API validation).*
8. Scroll to the bottom and click **Generate token**.
9. **Copy your new token immediately** (it begins with `github_pat_...`).
   > :warning: **IMPORTANT**: GitHub will never show this token again after you navigate away from this page. Keep it in your clipboard or a secure password manager.

---

## Step 3: Configure GitPulse Extension Settings

1. Open the GitPulse extension popup from your Chrome toolbar.
2. Click the **Settings** button in the footer (or right-click the extension icon and select **Options**).
3. In the Settings page, fill in the following:

| Setting Field | Description | Example Value |
| :--- | :--- | :--- |
| **GitHub owner / username** | Your exact GitHub username or organization name. | `zain-cmd-hub` |
| **Repository name** | The name of the target repository created in Step 1. | `30-Days-of-Code-2026---ACC` |
| **Fine-grained GitHub token** | The `github_pat_...` token you generated in Step 2. | `github_pat_11A...` (masked) |
| **Enable automatic upload** | Automatically sync solutions upon verified acceptance. | Checked (`true`) |

### Advanced Adapter Overrides (Optional)

The settings page includes optional adapter overrides for edge cases or site layout updates:

- **Optional success-dialog CSS selector**: Leave blank to use GitPulse's built-in dialog detection. Only supply a selector (e.g. `[role="dialog"]`) if the site changes its modal structure.
- **Optional accepted-text regex**: Default is blank (matches standard `ACCEPTED (n/n Passed)`).
- **Allow lower-confidence textarea / contenteditable extraction**: Keep unchecked by default. Check only if you are solving problems on a page that lacks Monaco/CodeMirror and uses a raw `<textarea>` element.

4. Click the **Save settings** button.
5. You should see the confirmation message:
   > *"Settings saved. Verify GitHub access next."*
   The token input field will clear automatically, and the hint will show:
   > *"Token saved securely in extension storage."*

---

## Step 4: Verify GitHub Access

1. On the GitPulse Settings page, click the **Verify GitHub access** button.
2. GitPulse will make a secure call to `https://api.github.com/repos/{owner}/{repo}` to validate your token and push access.
3. If successful, the status line will display:
   > *"Connected: username/repository (push permission verified)."*
4. If an error occurs, consult our [Troubleshooting Guide](./TROUBLESHOOTING.md).

---

## Step 5: Token Management & Disconnection

- **Keeping Your Token Updated**: When saving other settings in the future, you can leave the token field empty to retain your existing saved token.
- **Rotating Tokens**: When your GitHub token reaches its expiration date, generate a fresh token with identical permissions, paste it into the token field, and click **Save settings**.
- **Disconnecting**: Click the red **Remove saved token** button to purge the token from extension storage.

