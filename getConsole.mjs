import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
    page.on('response', response => {
        if (!response.ok()) {
            console.log('HTTP error:', response.status(), response.url());
        }
    });

    await page.goto('http://localhost:8083', { waitUntil: 'networkidle0' });

    await browser.close();
})();
