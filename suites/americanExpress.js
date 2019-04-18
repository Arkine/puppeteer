const Piper = require('../lib/application');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const path = require('path');

const checkDetails = require('../tests/american-express/checkDetails');
const formEmailErrorMsg = require('../tests/american-express/formEmailErrorMsg');
const formErrorMsg = require('../tests/american-express/formErrorMsg');

/**
 * Set the testing context
 * @param {Object} ctx ctx object
 * @param {Object} rest other properties to add onto the ctx
 */
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

/**
 * Close the browser after tests have been completed
 * @param {Object} ctx context properties
 */
const closeBrowser = async (ctx) => {
	await ctx.browser.close();

	return ctx;
}

describe('American Express', () => {

	{
		// Create the new testing pipeline
		const pipeline = new Piper({
			name: 'Ensure Card annual fees match'
		});

		// Set the context
		pipeline.setContext({
			// The url to test
			baseUrl: 'http://www.open.com',
			// The output directory for the screenshots
			imageOutputDir: path.join(__dirname, '../tests/american-express/screenshots')
		});

		// Add our test pipeline
		pipeline.addTests([
			{
				name: 'Dollar values match',
				before: setContext,
				test: checkDetails,
				after: closeBrowser
			}
		]);

		pipeline.start();
	}

	{
		const pipeline = new Piper({
			name: 'Ensure Invalid Email Address on Card Application Fails with Correct Error Messages'
		});

		pipeline.setContext({
			baseUrl: 'http://www.open.com',
			imageOutputDir: path.join(__dirname, '../tests/american-express/screenshots')
		});

		pipeline.addTests([
			{
				name: 'Displays the correct error message for invalid email',
				before: (ctx) => setContext(ctx, {
					testUser: {
						email: 'dog'
					}
				}),
				test: formEmailErrorMsg,
			},
			{
				name: 'Form displays corect error message for invalid form data',
				test: formErrorMsg,
				after: async (ctx) => {
					await ctx.page.screenshot({ path: `${ctx.imageOutputDir}/formfail.png`, fullPage: true });
					closeBrowser(ctx);
				}
			}
		]);

		pipeline.start();
	}
});
