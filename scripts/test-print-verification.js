/* eslint-disable @typescript-eslint/no-require-imports */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function verifyPrint() {
  console.log('Starting Puppeteer Print Verification...');
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });

    // 1. Switch to Structure / B2B Tab
    console.log('Selecting Structure / B2B chip...');
    const chips = await page.$$('.MuiChip-root');
    let foundStructure = false;
    for (const chip of chips) {
      const text = await page.evaluate(el => el.textContent, chip);
      if (text && text.includes('Structure')) {
        console.log('Found Structure chip:', text);
        await chip.click();
        foundStructure = true;
        break;
      }
    }
    if (!foundStructure) {
      console.error('Could not find Structure / B2B chip!');
    }
    await new Promise(r => setTimeout(r, 1200));

    // Fill Client Info
    const clientInput = await page.$('input[placeholder*="Apex Solar EPC Ltd"]');
    if (clientInput) {
      await clientInput.click({ clickCount: 3 });
      await clientInput.type('Apex Solar Infra Private Limited');
    }

    const outDir = '/Users/ratneshmishra/.gemini/antigravity-ide/brain/a359c681-8d5d-48c5-807a-bfb812701de0';
    fs.mkdirSync(outDir, { recursive: true });

    // Capture Screen Preview screenshot
    const previewBox = await page.$('.print-page');
    if (previewBox) {
      await previewBox.screenshot({
        path: path.join(outDir, 'b2b_screen_preview.png')
      });
      console.log('Saved b2b_screen_preview.png');
    }

    // Measure single page height before print
    await page.emulateMediaType('print');

    const singleHeightInfo = await page.evaluate(() => {
      const el = document.querySelector('.print-page');
      return el ? { height: el.getBoundingClientRect().height, scrollHeight: el.scrollHeight } : null;
    });
    console.log('Single page print element height:', singleHeightInfo);

    // Generate Single Page PDF
    const singlePdfPath = path.join(outDir, 'b2b_single_page.pdf');

    await page.pdf({
      path: singlePdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    console.log('Generated single page PDF:', singlePdfPath);

    // Capture single page print screenshot
    if (previewBox) {
      await previewBox.screenshot({
        path: path.join(outDir, 'b2b_single_page_print.png')
      });
      console.log('Saved b2b_single_page_print.png');
    }

    // Now test Multi-Page Quotation by adding more items!
    await page.emulateMediaType('screen');
    console.log('Adding multiple items to test 2+ page margin and pagination behavior...');

    // Find and click "Add" buttons in the catalog
    const addButtons = await page.$$('button');
    let addedCount = 0;
    for (const btn of addButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.trim() === 'Add') {
        await btn.click();
        addedCount++;
        await new Promise(r => setTimeout(r, 200));
        if (addedCount >= 7) break;
      }
    }
    console.log(`Successfully added ${addedCount} extra items from catalog.`);
    await new Promise(r => setTimeout(r, 1200));

    // Emulate print media for multi-page
    await page.emulateMediaType('print');

    const multiHeightInfo = await page.evaluate(() => {
      const el = document.querySelector('.print-page');
      return el ? { height: el.getBoundingClientRect().height, scrollHeight: el.scrollHeight } : null;
    });
    console.log('Multi page print element height:', multiHeightInfo);

    const multiPdfPath = path.join(outDir, 'b2b_multi_page.pdf');
    await page.pdf({
      path: multiPdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    console.log('Generated multi-page PDF:', multiPdfPath);

    // Capture multi-page full screenshot
    const fullPrintPage = await page.$('.print-page');
    if (fullPrintPage) {
      await fullPrintPage.screenshot({
        path: path.join(outDir, 'b2b_multi_page_print.png')
      });
      console.log('Saved b2b_multi_page_print.png');
    }

    // Check PDF page counts using binary inspection / pdf regex
    const getPageCount = (filePath) => {
      const data = fs.readFileSync(filePath).toString('latin1');
      const matches = data.match(/\/Type\s*\/Page\b/g);
      return matches ? matches.length : 0;
    };

    const singleCount = getPageCount(singlePdfPath);
    const multiCount = getPageCount(multiPdfPath);
    console.log(`\n=== Verification Results ===`);
    console.log(`Single Page Test: ${singleCount} page(s) (Expected: 1)`);
    console.log(`Multi Page Test: ${multiCount} page(s) (Expected: 2 or more)`);

    // Verify Service Proposal Print
    console.log('\nTesting Service Proposal Print...');
    await page.goto('http://localhost:3000/service', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.emulateMediaType('print');

    const servicePdfPath = path.join(outDir, 'service_single_page.pdf');
    await page.pdf({
      path: servicePdfPath,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    });
    const serviceCount = getPageCount(servicePdfPath);
    console.log(`Service Proposal Test: ${serviceCount} page(s)`);

    const servicePrintBox = await page.$('.print-page');
    if (servicePrintBox) {
      await servicePrintBox.screenshot({
        path: path.join(outDir, 'service_page_print.png')
      });
      console.log('Saved service_page_print.png');
    }

  } finally {
    await browser.close();
  }
}

verifyPrint().catch(err => {
  console.error('Print verification failed:', err);
  process.exit(1);
});
