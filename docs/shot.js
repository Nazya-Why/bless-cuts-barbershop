const { chromium } = require('playwright');
const path = require('path');

async function main() {
  const [,, urlArg, outDir] = process.argv;
  const url = urlArg.startsWith('http') ? urlArg : 'file:///' + path.resolve(urlArg).replace(/\\/g, '/');
  const widths = [375, 768, 1280, 1920];
  const browser = await chromium.launch();
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(700);
    // Force scroll-reveal elements visible for an accurate full-page audit screenshot
    // (their real trigger is IntersectionObserver on scroll, which a single full-page
    // capture never fires for off-screen content).
    await page.evaluate(() => {
      document.querySelectorAll('.reveal, .reveal-group').forEach(el => el.classList.add('in'));
      document.querySelectorAll('img[loading="lazy"]').forEach(img => img.loading = 'eager');
    });
    await page.evaluate(() => document.fonts ? document.fonts.ready : null);
    await page.waitForTimeout(600);
    const outPath = path.join(outDir, `full-${w}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('saved', outPath);
    await page.close();
  }
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
