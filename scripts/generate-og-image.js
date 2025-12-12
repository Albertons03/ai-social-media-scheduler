const playwright = require('playwright');
const path = require('path');

async function generateOGImage() {
  console.log('🚀 Generating Open Graph image...');

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();

  // Set viewport to OG image size
  await page.setViewportSize({ width: 1200, height: 630 });

  // Navigate to the HTML template
  const htmlPath = path.join(__dirname, '../public/og-preview-template.html');
  await page.goto(`file://${htmlPath}`);

  // Wait for animations to settle
  await page.waitForTimeout(1000);

  // Take screenshot
  const outputPath = path.join(__dirname, '../public/og-image.png');
  await page.screenshot({
    path: outputPath,
    type: 'png',
  });

  await browser.close();

  console.log('✅ OG image generated successfully at:', outputPath);
}

generateOGImage().catch(console.error);
