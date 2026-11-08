const fs = require('fs');
const path = require('path');

const mdFiles = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'docs/INSTALLATION.md',
  'docs/CONFIGURATION.md',
  'docs/USAGE.md',
  'docs/ARCHITECTURE.md',
  'docs/TROUBLESHOOTING.md'
];

let errors = 0;

for (const file of mdFiles) {
  let content = fs.readFileSync(file, 'utf8');
  // Strip fenced code blocks
  content = content.replace(/```[\s\S]*?```/g, '');
  const dir = path.dirname(file);
  const regex = /\[.*?\]\((?!https?:\/\/|#|mailto:)(.*?)\)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const rawTarget = match[1].split('#')[0];
    if (!rawTarget) continue;
    const resolved = path.resolve(dir, rawTarget);
    if (!fs.existsSync(resolved)) {
      console.error(`Broken link in ${file}: "${match[1]}" -> ${resolved}`);
      errors++;
    } else {
      console.log(`PASS: ${file} -> ${match[1]}`);
    }
  }
}

if (errors === 0) {
  console.log('\nAll prose markdown documentation links verified successfully!');
  process.exit(0);
} else {
  console.error(`\nFound ${errors} broken links.`);
  process.exit(1);
}

