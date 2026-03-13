const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
    page.on('response', response => {
        if (!response.ok()) {
            console.log('HTTP error:', response.status(), response.url());
        }
    });

    try {
        await page.goto('http://localhost:8083', { waitUntil: 'networkidle' });
    } catch (e) {
        console.log("Nav failed", e);
    }

    await new Promise(r => setTimeout(r, 2000));
    await browser.close();
})();
