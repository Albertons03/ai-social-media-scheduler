import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  try {
    // Navigate to settings
    console.log('Navigating to http://localhost:3000/settings...');
    const response = await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle' });
    console.log('Status:', response?.status());

    // Check for errors on page
    const errors = await page.evaluate(() => {
      return {
        pageTitle: document.title,
        pageUrl: window.location.href,
        errors: Array.from(document.querySelectorAll('[role="alert"], .error, .text-red')).map(el => el.innerText),
      };
    });

    console.log('Page info:', errors);

    // Look for the Connect TikTok button
    const connectBtn = await page.$('button:has-text("Connect TikTok")');
    if (connectBtn) {
      console.log('Found Connect TikTok button');
      
      // Try clicking it and capture navigation
      const [response] = await Promise.all([
        page.waitForNavigation(),
        connectBtn.click()
      ]);
      console.log('After click - Status:', response?.status());
      console.log('After click - URL:', page.url());
    } else {
      console.log('Connect TikTok button not found');
      // List all buttons
      const buttons = await page.$$eval('button', buttons => buttons.map(b => b.innerText));
      console.log('Available buttons:', buttons);
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
