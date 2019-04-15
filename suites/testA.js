const Piper = require('../lib/application');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const path = require('path');

const navigateLogin = require('../tests/american-express/navigateLogin');
const hasCorrectTitle = require('../tests/american-express/hasCorrectTitle');
const rejectsIncorrectLogin = require('../tests/american-express/rejectsIncorrectLogin');


// let browser;
// let page; 

const setContext = async (ctx, rest) => {
	ctx.browser = await puppeteer.launch({
		headless: true
	});
	ctx.page = await ctx.browser.newPage();
	
	// Set the page to be english. Showing in German for some reason
	await ctx.page.setExtraHTTPHeaders({
        'Accept-Language': 'en'
    });

	return {...ctx, ...rest};
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
			imageOutputDir: path.join(__dirname, '../tests/american-express/screenshots')
		});

		pipeline.addTests([
			{
				name: 'Should navigate to the login page on login bttn click',
				before: setContext,
				test: navigateLogin,
				after: closeBrowser,
			},
			{
				name: 'Should have the correct title',
				before: setContext,
				test: hasCorrectTitle,
				after: closeBrowser
			},
			{
				name: 'Should reject invalidLogin',
				before: (ctx) => {
					ctx = setContext(ctx, {
						user: {
							username: 'dog',
							password: 'woof'
						}
					});

					return ctx;
				},
				test: rejectsIncorrectLogin,
				after: closeBrowser
			}
		]);

		pipeline.start();
	})
});
