const Piper = require('../lib/application');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const path = require('path');

const navigateLogin = require('../tests/navigateLogin');
const getGoogleTitle = require('../tests/getGoogle');


// let browser;
// let page; 

const getFoundation = async (ctx) => {
	ctx.browser = await puppeteer.launch({
		headless: true
	});
	ctx.page = await ctx.browser.newPage();

	return ctx;
}

const closeBrowser = async (ctx) => {
	await ctx.browser.close();

	return ctx;
}

describe('American Express', () => {
	it('Should navigate to login', async () => {
		const pipeline = new Piper({
			name: 'AE tests'
		});

		pipeline.setContext({
			baseUrl: 'https://www.americanexpress.com',
			imageOutputDir: path.join(__dirname, '../tests/screenshots/ae')
		});

		pipeline.addTests([
			{
				name: 'Should navigate to the login page on login bttn click',
				before: getFoundation,
				test: navigateLogin,
				after: closeBrowser,
				timeout: 5
			},
			{
				name: 'Should get google title',
				before: getFoundation,
				test: getGoogleTitle,
				after: closeBrowser
			}
		]);

		pipeline.start();
	})
});
