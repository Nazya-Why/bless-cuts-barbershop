const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const url = 'file:///' + path.resolve('index.html').replace(/\\/g, '/');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.querySelectorAll('.reveal, .reveal-group').forEach(el => el.classList.add('in'));
  });
  // Let CSS opacity/transform transitions fully settle before sampling styles —
  // scanning mid-transition gives axe a blended, misleadingly-lighter color.
  await page.waitForTimeout(2200);
  const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  await page.addScriptTag({ content: axeSource });
  const results = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] }
    });
  });
  fs.writeFileSync('docs/axe-report.json', JSON.stringify(results, null, 2));
  console.log('VIOLATIONS:', results.violations.length);
  results.violations.forEach(v => {
    console.log(`\n[${v.impact}] ${v.id}: ${v.help}`);
    console.log('  nodes:', v.nodes.length);
    v.nodes.slice(0, 3).forEach(n => console.log('   -', n.target.join(' '), '|', (n.failureSummary||'').replace(/\n/g,' ').slice(0,160)));
  });
  console.log('\nINCOMPLETE:', results.incomplete.length);
  results.incomplete.forEach(v => {
    console.log(`  [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)`);
  });
  console.log('\nPASSES:', results.passes.length);
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
