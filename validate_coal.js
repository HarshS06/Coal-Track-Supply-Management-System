const fs = require('fs');
const path = 'c:/Users/nshah/OneDrive/Desktop/editing/coal.html';
const html = fs.readFileSync(path, 'utf8');
const scripts = [...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)];
if (!scripts.length) {
  console.log('No scripts found');
  process.exit(0);
}
for (let i = 0; i < scripts.length; i++) {
  const script = scripts[i][1];
  const tempPath = `c:/Users/nshah/OneDrive/Desktop/editing/tmp_script_${i}.js`;
  fs.writeFileSync(tempPath, script, 'utf8');
  const { execSync } = require('child_process');
  try {
    execSync(`node --check "${tempPath}"`, { stdio: 'inherit' });
    console.log(`SCRIPT ${i}: ok`);
  } catch (error) {
    console.error(`SCRIPT ${i}: failed`);
    process.exit(1);
  }
}
console.log('JS syntax OK');
