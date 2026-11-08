# GitPulse Configuration Guide

This guide walks you through setting up your GitHub repository, generating a secure fine-grained Personal Access Token (PAT), and configuring the **GitPulse** extension settings.

---

## Visual Configuration Flow

```text
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│ 1. Create Target Repo   │ ───► │ 2. Generate Scoped PAT  │ ───► │ 3. Configure GitPulse   │
│    (Public or Private)  │      │    (Contents: Read/Write│      │    Settings Page        │
└─────────────────────────┘      └─────────────────────────┘      └────────────┬────────────┘
                                                                               │
                                                                  ┌────────────▼────────────┐
                                                                  │ 4. Click "Verify Access"│
                                                                  │    (Push auth verified) │
                                                                  └─────────────────────────┘
```

---

## Step 1: Create a GitHub Target Repository

1. Log in to [GitHub](https://github.com/).
2. Click **+** in the top-right corner → **New repository** (or visit [https://github.com/new](https://github.com/new)).
3. Fill in the repository settings:
   - **Repository name**: e.g., `30-Days-of-Code-2026---ACC` or `coding-challenges`
   - **Visibility**: Choose **Public** or **Private** (both are supported)
   - **Initialize with README**: Checked (recommended)
4. Click **Create repository**.
5. Note your exact GitHub username (e.g. `zain-cmd-hub`) and repository name.

---

## Step 2: Generate a Fine-Grained Personal Access Token (PAT)

### Visual Walkthrough of GitHub Token Settings

1. Visit [GitHub Fine-Grained Tokens](https://github.com/settings/tokens?type=beta).
2. Click **Generate new token**.
3. Fill in the required fields:

```text
GitHub Token Creation Interface:
┌────────────────────────────────────────────────────────────────────────┐
│ Token name:    [ GitPulse-Sync                                       ] │
│ Expiration:    [ 90 days                                           ▼ ] │
│ Description:   [ Automated coding submission synchronization         ] │
│                                                                        │
│ Repository access:                                                     │
│ ( ) All repositories                                                   │
│ (●) Only select repositories                                           │
│     [ Select repositories: 30-Days-of-Code-2026---ACC              ▼ ] │
│                                                                        │
│ Repository permissions:                                                │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ Contents         Access: [ Read and write                        ▼]│ │
│ │ (Metadata is automatically set to Read-only)                       │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ [ Generate token ]                                                     │
└────────────────────────────────────────────────────────────────────────┘
```

4. Click **Generate token**.
5. Copy your new token immediately (`github_pat_11A...`).

---

## Step 3: Configure GitPulse Settings Page

1. Open GitPulse and click **Settings** (or right-click extension icon → **Options**).
2. Enter your details:

```text
GitPulse Settings Screen:
┌────────────────────────────────────────────────────────────────────────┐
│ GitPulse Settings                                                      │
│ Connect one GitHub repository. Your token stays in extension storage.  │
│                                                                        │
│ GitHub owner / username                                                │
│ [ zain-cmd-hub                                                       ] │
│                                                                        │
│ Repository name                                                        │
│ [ 30-Days-of-Code-2026---ACC                                         ] │
│                                                                        │
│ Fine-grained GitHub token                                              │
│ [ •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••• ] │
│ Token saved securely in extension storage.                             │
│                                                                        │
│ [✓] Enable automatic upload after verified ACCEPTED result             │
│                                                                        │
│ [ Save settings ]   [ Verify GitHub access ]   [ Remove saved token ]  │
│                                                                        │
│ Status: Connected: zain-cmd-hub/30-Days-of-Code-2026---ACC (push ok)   │
└────────────────────────────────────────────────────────────────────────┘
```

3. Click **Save settings**.
4. Click **Verify GitHub access** to confirm the token has push permissions.

If any issues occur, consult the [Troubleshooting Guide](./TROUBLESHOOTING.md).
