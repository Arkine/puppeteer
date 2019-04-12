const puppeteer = require('puppeteer');
const assert = require('assert');

module.exports = async (ctx) => {
	// console.log('nav login', ctx);
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();

    // // Goto the AE homepage
    // await ctx.page.goto(`${ctx.baseUrl}/us/credit-cards/business`);

    // await ctx.page.waitForSelector('#gnav_login', { visible: true });
    // // const loginBtn = page.$('#gnav_login');

    // await ctx.page.click('#gnav_login');

    // await ctx.page.waitForNavigation();

    // // await page.click()

	// await ctx.browser.close();

	// ctx.cat = 'meow';

	await ctx.page.goto(ctx.baseUrl, { waitUntil: 'networkidle0' });
	const title = await ctx.page.title();
	assert.equal(title, 'Business Solutions from American express');

	// await ctx.browser.close();

	return ctx;
}