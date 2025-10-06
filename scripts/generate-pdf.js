const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const src = path.resolve(__dirname, '../docs/ExpenseTracker_Documentation.html');
  const out = path.resolve(__dirname, '../docs/ExpenseTracker_Documentation.pdf');
  if (!fs.existsSync(src)) {
    console.error('Source HTML not found:', src);
    process.exit(1);
  }
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + src, { waitUntil: 'load' });
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', right: '12mm', bottom: '16mm', left: '12mm' },
  });
  await browser.close();
  console.log('PDF written to', out);
})();
