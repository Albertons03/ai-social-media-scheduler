import * as fs from 'fs';
import * as path from 'path';

const replacements: Record<string, string> = {
  // Text colors
  'text-gray-900': 'text-foreground',
  'text-gray-800': 'text-foreground',
  'text-gray-700': 'text-muted-foreground',
  'text-gray-600': 'text-muted-foreground',
  'text-gray-500': 'text-muted-foreground',
  'text-gray-400': 'text-muted-foreground',

  // Backgrounds (not colored badges!)
  'bg-gray-50': 'bg-background',
  'bg-gray-100': 'bg-accent',

  // Borders
  'border-gray-200': 'border-border',
  'border-gray-300': 'border-border',

  // Hover states
  'hover:bg-gray-50': 'hover:bg-accent',
};

const filesToFix = [
  'app/(dashboard)/settings/page.tsx',
  'app/(dashboard)/analytics/page.tsx',
  'components/post/post-form.tsx',
  'components/calendar/calendar-view.tsx',
];

function fixFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    console.log(`❌ File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let changeCount = 0;

  for (const [oldClass, newClass] of Object.entries(replacements)) {
    const regex = new RegExp(oldClass.replace('-', '\\-'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newClass);
      changeCount += matches.length;
    }
  }

  if (changeCount > 0) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed ${filePath} - ${changeCount} replacements`);
  } else {
    console.log(`⏭️  Skipped ${filePath} - no changes needed`);
  }
}

console.log('🎨 Fixing dark mode text visibility...\n');

for (const file of filesToFix) {
  fixFile(file);
}

console.log('\n✨ Done!');
