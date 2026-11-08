# GitPulse Usage Guide

This guide describes the end-to-end user workflow when solving coding challenges with **GitPulse**, from opening a problem to viewing automated commits on GitHub.

---

## Standard Workflow Overview

```
1. Open Challenge Tab ──► 2. Run Diagnostics ──► 3. Write Solution ──► 4. Click Submit ──► 5. Auto-Sync to GitHub
   (https://30accd.xyz)      (Popup inspector)       (In-page editor)       (Arms 120s timer)     (Archives & Updates)
```

---

## 1. Opening a Challenge Page

1. Open Google Chrome.
2. Navigate to `https://30accd.xyz/dashboard` and select an active coding challenge (e.g. `dsa-day-06-contains-duplicate-ii`).
3. Ensure the challenge page has finished loading its code editor.

---

## 2. Using the In-Browser Diagnostics Tool

Before submitting for the first time on any challenge, you can inspect GitPulse's page analysis in real time:

1. Click the **GitPulse** extension icon in your Chrome toolbar.
2. In the popup card titled **Current page diagnostics**, click **Run diagnostics**.
3. The popup will display an instant diagnostic breakdown:

| Diagnostic Metric | Meaning | Expected Healthy State |
| :--- | :--- | :--- |
| **Day** | Extracted day number from URL or page text | `1` to `30` |
| **Challenge ID** | Challenge slug from URL path | `dsa-day-06-contains-duplicate-ii` |
| **Difficulty** | Extracted challenge difficulty | `easy`, `medium`, or `hard` |
| **Editor** | Identified editor engine in the page context | `monaco`, `codemirror5`, `codemirror6`, or `ace` |
| **Editor count** | Number of code editors detected on the page | `1` or more |
| **Language** | Detected programming language | `javascript`, `python`, `cpp`, `java`, etc. |
| **Code length** | Character length of the code inside the editor | Non-zero value (e.g. `245`) |
| **Extraction** | Confidence tier of code extraction | `api` (high confidence) |
| **Submit button** | Status of the challenge submission button | `Detected` |

> :bulb: **Tip**: If you ever experience issues, click **Copy report**. GitPulse will copy a sanitized JSON summary to your clipboard with no credentials or source code, which you can paste into a GitHub issue.

---

## 3. Writing and Submitting Code

1. Write or paste your solution in the website's code editor.
2. Select your desired language from the platform's language selector dropdown.
3. When you are ready, click the platform's **Submit** or **Update Solution** button.

### What Happens Behind the Scenes:
- GitPulse detects the click event on the submission button.
- A debouncing guard prevents multiple rapid triggers (1.5-second cooldown).
- GitPulse requests a clean snapshot of your code directly from the editor's page-world model via `page-bridge.js`.
- If the editor contains valid code, GitPulse arms an **acceptance monitoring window** for 120 seconds.
- An on-screen toast alert appears in the lower-right corner of the page:
  > *"Submission attempt detected. ACCEPTED result ka wait ho raha hai…"*

---

## 4. Automatic Acceptance Detection & Upload

When the platform backend evaluates your code and sends the response:

1. A success modal appears on the webpage containing:
   - `Solution Updated Successfully!`
   - `ACCEPTED (n/n Passed)`
2. GitPulse's active `MutationObserver` detects the newly inserted modal elements.
3. The extension extracts:
   - Passed test case count (e.g., `1`)
   - Total test case count (e.g., `1`)
   - Calculated pass percentage (e.g., `100%`)
4. The content script packages the solution and dispatches an internal message to the background service worker:
   `UPLOAD_ACCEPTED_SUBMISSION`
5. The background service worker authenticates with the GitHub REST API and performs the multi-file commit sequence.
6. A success toast notification appears in the lower-right corner:
   > *"ACCEPTED submission GitHub par save ho gaya!"*

---

## 5. What Gets Created in Your GitHub Repository

For every verified accepted solution, GitPulse commits the following structure:

```text
your-repository/
├── README.md                                  # Root 30-day dashboard table
└── Day-06/
    ├── solution.js                            # Latest accepted solution code
    ├── README.md                              # Challenge overview & metadata
    └── submissions/
        ├── 2026-11-08T08-15-22-123Z-a1b2c3d4.js    # Immutable attempt archive
        └── 2026-11-08T08-15-22-123Z-a1b2c3d4.json  # Comprehensive attempt metadata
```

### File Details & Examples

#### A. Latest Solution (`Day-XX/solution.<ext>`)
Contains the clean source code of your latest accepted solution:
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {boolean}
 */
var containsNearbyDuplicate = function(nums, k) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        if (map.has(nums[i]) && i - map.get(nums[i]) <= k) {
            return true;
        }
        map.set(nums[i], i);
    }
    return false;
};
```

#### B. Submission Metadata (`Day-XX/submissions/<timestamp>-<id>.json`)
Provides full audit telemetry for every single accepted submission:
```json
{
  "submission_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "day": 6,
  "challenge_id": "dsa-day-06-contains-duplicate-ii",
  "challenge_title": "Contains Duplicate II",
  "difficulty": "easy",
  "language": "javascript",
  "status": "ACCEPTED",
  "passed_test_cases": 1,
  "total_test_cases": 1,
  "pass_percentage": 100,
  "runtime": null,
  "memory": null,
  "elapsed_time": null,
  "submitted_at": "2026-11-08T08:15:22.123Z",
  "source_url": "https://30accd.xyz/dashboard/dsa-day-06-contains-duplicate-ii",
  "source_file": "solution.js",
  "editor_type": "monaco",
  "editor_confidence": "api",
  "success_evidence": "fresh post-click success dialog text"
}
```

#### C. Day Summary (`Day-XX/README.md`)
A markdown document summarizing the problem and linking to the source code:
```markdown
<!-- 30ACC-LEETHUB:START -->
# Contains Duplicate II

- **Day:** 6
- **Difficulty:** easy
- **Language:** javascript
- **Status:** ACCEPTED
- **Passed:** 1 / 1
- **Pass rate:** 100%
- **Runtime:** Not provided
- **Memory:** Not provided
- **Submitted:** 2026-11-08T08:15:22.123Z
- **Problem:** https://30accd.xyz/dashboard/dsa-day-06-contains-duplicate-ii
- **Latest solution:** [solution.js](./solution.js)
- **Archive:** [2026-11-08T08-15-22-123Z-a1b2c3d4.js](./submissions/2026-11-08T08-15-22-123Z-a1b2c3d4.js)
<!-- 30ACC-LEETHUB:END -->
```

#### D. Root Repository Progress Dashboard (`README.md`)
Maintains an automated progress tracker across all 30 days without overwriting any custom notes you write outside the managed comment blocks:
```markdown
# 30 Days of Code — ACC

<!-- 30ACC-LEETHUB:START -->
## 30 Days of Code — Progress Dashboard

Latest accepted submission: **Contains Duplicate II** (Day 6) · 2026-11-08T08:15:22.123Z

| Day | Details | Challenge | Difficulty | Language | Status |
|---|---|---|---|---|---|
| 01 | [Day 01](./Day-01/README.md) | Two Sum | easy | python | ACCEPTED |
| 02 | [Day 02](./Day-02/README.md) | Best Time to Buy and Sell Stock | easy | cpp | ACCEPTED |
| ... | ... | ... | ... | ... | ... |
| 06 | [Day 06](./Day-06/README.md) | Contains Duplicate II | easy | javascript | ACCEPTED |
| 07 | — | — | — | — | — |
<!-- 30ACC-LEETHUB:END -->
```

---

## 6. How Failed or Run-Only Submissions Are Handled

GitPulse intentionally avoids polluting your repository with broken attempts:

- **Run Code Clicked**: Clicking "Run Code" executes test cases locally on the site. GitPulse ignores this because the button label is not a submission trigger.
- **Wrong Answer / Failed Tests**: If tests fail, the platform displays error alerts or red failing badges. GitPulse's observer checks for `ACCEPTED` and `Solution Updated Successfully!`. Since they are absent, no upload occurs.
- **Arming Timeout**: If an accepted modal does not appear within 120 seconds of clicking Submit, the armed state automatically disarms.

