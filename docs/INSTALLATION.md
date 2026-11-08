# GitPulse Installation Guide

A comprehensive, beginner-friendly walkthrough for installing, setting up, and verifying **GitPulse** as an unpacked extension in Google Chrome and other Chromium-based web browsers.

---

## Visual Installation Flowchart

```text
┌─────────────────────┐      ┌─────────────────────┐      ┌─────────────────────┐
│ 1. Download / Extract│ ───► │ 2. Open Extensions  │ ───► │ 3. Developer Mode   │
│    GitPulse Folder   │      │    chrome://extensions│   │    Toggle ON [●]    │
└─────────────────────┘      └─────────────────────┘      └──────────┬──────────┘
                                                                     │
┌─────────────────────┐      ┌─────────────────────┐      ┌──────────▼──────────┐
│ 6. Verify Diagnostic│ ◄─── │ 5. Pin to Toolbar   │ ◄─── │ 4. Click "Load      │
│    on 30accd.xyz     │      │    Click Puzzle [📌] │      │    unpacked" Folder │
└─────────────────────┘      └─────────────────────┘      └─────────────────────┘
```

---

## Step 1: Clone or Download GitPulse

### Option A: Download as a ZIP (Beginner Friendly)
1. Download GitPulse using the direct download button in `README.md` or via GitHub:
   - [Download GitPulse ZIP](https://github.com/zain-cmd-hub/GitPulse/archive/refs/heads/main.zip)
2. Locate `GitPulse-main.zip` in your `Downloads` folder.
3. Right-click and choose **Extract All...** (Windows) or double-click to uncompress (macOS/Linux).
4. Verify you see the extracted folder containing `manifest.json`, `background/`, `content/`, and `popup/`.

### Option B: Clone using Git
```bash
git clone https://github.com/zain-cmd-hub/GitPulse.git
cd GitPulse
```

---

## Step 2: Open Chrome Extensions Page

1. Launch Google Chrome.
2. In the Chrome address bar, type:
   ```text
   chrome://extensions/
   ```
   and press **Enter**.

---

## Step 3: Enable Developer Mode (Visual Guide)

In the top-right corner of the Extensions page, locate and toggle **Developer mode**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ Extensions                                          Developer mode [●] │
├────────────────────────────────────────────────────────────────────────┤
│ [Load unpacked]  [Pack extension]  [Update]                            │
└────────────────────────────────────────────────────────────────────────┘
```

- When turned **ON**, the three toolbar buttons appear: **Load unpacked**, **Pack extension**, and **Update**.

---

## Step 4: Click "Load unpacked" & Select Folder

1. Click the **Load unpacked** button in the top-left toolbar.
2. In the folder picker, select the GitPulse root directory:
   ```text
   C:\Users\Abbas\Downloads\30ACC-LeetHub-Complete-Fixed\30ACC-LeetHub-Complete
   ```
   *(Select the folder directly containing `manifest.json`).*
3. Click **Select Folder**.
4. You will immediately see the **GitPulse** extension card installed:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [GP] GitPulse 1.0.0                                       [Details]│ │
│ │ Capture verified accepted 30ACC coding submissions and archive...  │ │
│ │ ID: your-extension-id-here                                         │ │
│ │ Inspect views: service worker (active)                             │ │
│ │                                                         [🔄]  [●]  │ │
│ └────────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Step 5: Pin GitPulse to Your Chrome Toolbar

1. Click the **Extensions Puzzle Piece icon** (🧩) in the top-right Chrome toolbar.
2. Find **GitPulse** in the list.
3. Click the **Pin icon** (📌) next to it so it turns blue.

```text
Chrome Toolbar:
┌──────────────────────────────────────────────────────────────┐
│  [ < ] [ > ] [ 🔄 ]  [ https://30accd.xyz/dashboard ]    [GP] [🧩] [👤]│
└──────────────────────────────────────────────────────────────┘
                                                             ▲
                                                    Pinned GitPulse Icon
```

---

## Step 6: Initial Configuration & Verification

1. Click the pinned **GitPulse (GP)** icon in your toolbar.
2. The popup interface will appear:

```text
┌──────────────────────────────────────────────┐
│  [GP] GitPulse                               │
│       Challenge → Accepted → GitHub          │
├──────────────────────────────────────────────┤
│  GitHub                      [ Checking… ]   │
│  Not configured                              │
│  [ Verify GitHub ]                           │
├──────────────────────────────────────────────┤
│  Current page diagnostics                    │
│  Open a 30accd.xyz challenge page.           │
│  [ Run diagnostics ]   [ Copy report ]       │
├──────────────────────────────────────────────┤
│  Automatic upload                    [ — ]   │
│  Uploads only after fresh accepted dialog    │
├──────────────────────────────────────────────┤
│  [ Settings ]          [ Open repository ]   │
└──────────────────────────────────────────────┘
```

3. Click the **Settings** button to open the Options page.
4. Follow the [Configuration Guide](./CONFIGURATION.md) to link your GitHub repository and token.

---

## Step 7: Visual Verification on Challenge Page

1. Open `https://30accd.xyz/dashboard` and select any coding problem.
2. Click the GitPulse icon and click **Run diagnostics**.
3. You should see a live healthy readout:

```text
┌──────────────────────────────────────────────┐
│  Current page diagnostics                    │
│  Contains Duplicate II                       │
│  ------------------------------------------  │
│  Day: 6                                      │
│  Challenge ID: dsa-day-06-contains-duplicate │
│  Difficulty: easy                            │
│  Editor: monaco                              │
│  Editor count: 1                             │
│  Language: javascript                        │
│  Code length: 245                            │
│  Extraction: api                             │
│  Submit button: Detected                     │
│                                              │
│  [ Run diagnostics ]   [ Copy report ]       │
└──────────────────────────────────────────────┘
```

4. Write your solution and click **Submit Solution**.
5. GitPulse will display an on-screen toast in the lower right:
   ```text
   ┌──────────────────────────────────────────────────────────┐
   │ ⚡ Submission attempt detected. ACCEPTED result ka wait...│
   └──────────────────────────────────────────────────────────┘
   ```
6. Once the platform evaluates your solution as `ACCEPTED`, GitPulse updates GitHub and displays:
   ```text
   ┌──────────────────────────────────────────────────────────┐
   │ ⚡ ACCEPTED submission GitHub par save ho gaya!          │
   └──────────────────────────────────────────────────────────┘
   ```

---

## How to Reload After Code Changes

When you make changes to files:
1. Go to `chrome://extensions/`.
2. Locate the **GitPulse** card.
3. Click the **Reload icon** (🔄).
4. Refresh your challenge tab on `30accd.xyz`.
