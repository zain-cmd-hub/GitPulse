// GitPulse Test Suite
// Run with: node tests/smoke-test.js

const assert = require('node:assert/strict');

// 1. Language Normalization Test
function langMap(s) {
  const v = String(s || '').toLowerCase();
  if (/javascript|\bjs\b/.test(v)) return 'javascript';
  if (/typescript|\bts\b/.test(v)) return 'typescript';
  if (/python|\bpy\b/.test(v)) return 'python';
  if (/c\+\+|\bcpp\b/.test(v)) return 'cpp';
  if (/c#|csharp/.test(v)) return 'csharp';
  if (/golang|\bgo\b/.test(v)) return 'go';
  if (/\bjava\b/.test(v)) return 'java';
  if (/\brust\b/.test(v)) return 'rust';
  if (/\bc\b/.test(v)) return 'c';
  return null;
}

assert.equal(langMap('Java'), 'java');
assert.equal(langMap('JavaScript'), 'javascript');
assert.equal(langMap('C++'), 'cpp');
assert.equal(langMap('Python 3'), 'python');
assert.equal(langMap('TypeScript'), 'typescript');
assert.equal(langMap('Rust'), 'rust');
assert.equal(langMap('C'), 'c');
assert.equal(langMap('Go'), 'go');
assert.equal(langMap('C#'), 'csharp');
assert.equal(langMap('Ruby'), null);

// 2. Acceptance Criteria Patterns
const accepted = 'Solution Updated Successfully! Day 6 · Contains Duplicate II ACCEPTED (1/1 Passed)';
assert.match(accepted, /solution\s+updated\s+successfully/i);
assert.match(accepted, /\baccepted\s*\(\s*\d+\s*\/\s*\d+\s*passed\s*\)/i);
assert.doesNotMatch('Saved successfully', /\baccepted\s*\(\s*\d+\s*\/\s*\d+\s*passed\s*\)/i);
assert.doesNotMatch('Runtime Error', /\baccepted\s*\(\s*\d+\s*\/\s*\d+\s*passed\s*\)/i);

// 3. Test Cases Extraction
const testCaseMatch = accepted.match(/accepted\s*\(\s*(\d+)\s*\/\s*(\d+)\s*passed\s*\)/i);
assert.notEqual(testCaseMatch, null);
assert.equal(Number(testCaseMatch[1]), 1);
assert.equal(Number(testCaseMatch[2]), 1);

// 4. Slug & Path Sanitization
const safe = s => String(s || 'challenge')
  .normalize('NFKD')
  .replace(/[^a-zA-Z0-9-_]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 70) || 'challenge';

assert.equal(safe('Contains Duplicate II'), 'Contains-Duplicate-II');
assert.equal(safe('Valid Palindrome (Simple & Fast)'), 'Valid-Palindrome-Simple-Fast');
assert.equal(safe(''), 'challenge');

// 5. Day Directory Formatting
function formatDay(day) {
  return Number.isInteger(day) && day >= 1 && day <= 30
    ? `Day-${String(day).padStart(2, '0')}`
    : 'Unassigned-Day';
}

assert.equal(formatDay(1), 'Day-01');
assert.equal(formatDay(6), 'Day-06');
assert.equal(formatDay(30), 'Day-30');
assert.equal(formatDay(0), 'Unassigned-Day');
assert.equal(formatDay(35), 'Unassigned-Day');
assert.equal(formatDay(null), 'Unassigned-Day');

// 6. Managed Marker Replacement Test
function mergeManaged(oldText, section) {
  const start = '<!-- 30ACC-LEETHUB:START -->';
  const end = '<!-- 30ACC-LEETHUB:END -->';
  if (oldText.includes(start) && oldText.includes(end)) {
    return oldText.replace(new RegExp(`${start}[\\s\\S]*?${end}`), section);
  }
  return (oldText.trim() ? oldText.trim() + '\n\n' : '') + section + '\n';
}

const initialReadme = '# My Repository\nCustom notes here.\n';
const section1 = '<!-- 30ACC-LEETHUB:START -->\nDashboard v1\n<!-- 30ACC-LEETHUB:END -->';
const merged1 = mergeManaged(initialReadme, section1);
assert.ok(merged1.includes('Custom notes here.'));
assert.ok(merged1.includes('Dashboard v1'));

const section2 = '<!-- 30ACC-LEETHUB:START -->\nDashboard v2\n<!-- 30ACC-LEETHUB:END -->';
const merged2 = mergeManaged(merged1, section2);
assert.ok(merged2.includes('Custom notes here.'));
assert.ok(merged2.includes('Dashboard v2'));
assert.ok(!merged2.includes('Dashboard v1'));

console.log('All tests passed successfully:');
console.log(' - Language normalization & mappings');
console.log(' - Acceptance regex & test case parsing');
console.log(' - Title/slug sanitization');
console.log(' - Day directory formatting');
console.log(' - Managed section merge algorithm');
