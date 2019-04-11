const puppeteer = require('puppeteer');

module.exports = async (context) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Goto the AE homepage
    await page.goto(`${context.baseUrl}/us/credit-cards/business`);
    
    await page.waitForSelector('#gnav_login', { visible: true });
    // const loginBtn = page.$('#gnav_login');

    await page.click('#gnav_login');

    await page.waitForNavigation();

    // await page.click()

    await browser.close();
}