# GitPulse Installation Guide

A comprehensive, beginner-friendly walkthrough for installing, setting up, and verifying **GitPulse** as an unpacked extension in Google Chrome and other Chromium-based web browsers.

---

## Prerequisites

Before starting, ensure you have:

1. A modern Chromium-based web browser:
   - **Google Chrome** (v88 or newer recommended)
   - **Brave**, **Microsoft Edge**, **Opera**, or **Arc**
2. An active [GitHub account](https://github.com/).
3. A local copy or ZIP download of the GitPulse project folder.

---

## Step 1: Clone or Download GitPulse

### Option A: Download as a ZIP (Beginner Friendly)
1. Navigate to the GitHub repository: [https://github.com/zain-cmd-hub/GitPulse](https://github.com/zain-cmd-hub/GitPulse).
2. Click the green **Code** button and select **Download ZIP**.
3. Locate the downloaded file (e.g., `GitPulse-main.zip`) in your `Downloads` folder.
4. Right-click the file and select **Extract All...** (Windows) or double-click to uncompress (macOS/Linux).
5. Ensure you have a folder containing `manifest.json`, `background/`, `content/`, `popup/`, and `options/`.

### Option B: Clone using Git (Recommended for Developers)
Open your terminal or PowerShell and run:
```bash
git clone https://github.com/zain-cmd-hub/GitPulse.git
cd GitPulse
```

---

## Step 2: Open Chrome Extensions Page

1. Launch Google Chrome.
2. In the Chrome address bar (URL bar), type:
   ```text
   chrome://extensions/
   ```
   and press **Enter**.
3. Alternatively, you can click the **three dots menu (⋮)** in the top right corner of Chrome → **Extensions** → **Manage Extensions**.

---

## Step 3: Enable Developer Mode

In the top-right corner of the Extensions page, look for the toggle switch labeled **Developer mode**.

```
┌──────────────────────────────────────────────────────────────┐
│ Extensions                               [ Developer mode ] ◉│
└──────────────────────────────────────────────────────────────┘
```

- Click the toggle switch to turn it **ON** (blue).
- Notice that three new buttons appear in the top-left toolbar:
  - **Load unpacked**
  - **Pack extension**
  - **Update**

---

## Step 4: Load the Unpacked Extension

1. Click the **Load unpacked** button in the top-left corner.
2. A folder picker dialog will appear.
3. Browse to and select the root directory of GitPulse (the folder that directly contains `manifest.json`).
4. Click **Select Folder** (Windows) or **Select** (macOS).
5. The **GitPulse** extension card will now appear in your list of installed extensions with version `1.0.0` and description:
   > *"Capture verified accepted 30ACC coding submissions and archive them to GitHub."*

---

## Step 5: Pin GitPulse to Your Toolbar

To make GitPulse easily accessible while coding:

1. Click the **Puzzle Piece icon** (Extensions) in the top-right corner of Chrome's toolbar (next to your profile picture).
2. Find **GitPulse** in the dropdown list.
3. Click the **Pin icon** (📌) next to GitPulse so it turns blue.
4. The GitPulse **GP** icon is now pinned to your toolbar.

---

## Step 6: Initial Configuration

1. Click the pinned **GitPulse** icon in your toolbar to open the popup.
2. Click the **Settings** button at the bottom of the popup (or right-click the GitPulse icon and select **Options**).
3. Follow our step-by-step [Configuration Guide](./CONFIGURATION.md) to:
   - Create your GitHub target repository.
   - Generate a fine-grained Personal Access Token with `Contents: Read and write` permissions.
   - Save credentials and verify repository access.

---

## Step 7: Verify Installation on the Coding Platform

1. Navigate to `https://30accd.xyz/dashboard` and open an active coding challenge.
2. Click the pinned **GitPulse** extension icon.
3. Click **Run diagnostics**.
4. Confirm that:
   - **Editor** displays your active editor (e.g., `monaco`, `codemirror5`, `codemirror6`, or `ace`).
   - **Language** displays your selected programming language.
   - **Code length** reflects a non-zero character count.
   - **Submit button** displays `Detected`.

Congratulations! GitPulse is now fully installed and primed for automated solution synchronization.

---

## How to Update GitPulse When You Make Code Changes

Since GitPulse is loaded unpacked:
1. Whenever you edit or pull code updates, open `chrome://extensions/`.
2. Locate the **GitPulse** extension card.
3. Click the circular **Reload** icon (🔄).
4. Refresh any open challenge tabs on `https://30accd.xyz/` to load the latest scripts.

