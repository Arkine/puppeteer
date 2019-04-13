const Piper = require('../lib/application');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

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
		});

		pipeline.addTests([
			{
				name: '/ GET',
				before: getFoundation,
				test: navigateLogin,
				after: closeBrowser
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
