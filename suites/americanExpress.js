const Piper = require('../lib/application');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: '../.env'});

const path = require('path');

const checkDetails = require('../tests/american-express/checkDetails');
const loginFailsWithError = require('../tests/american-express/loginFailsWithError');

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
	
	// Create the new testing pipeline
	const pipeline = new Piper({
		name: 'Ensure Card Information in All Cards View is Present on the Card Detail View'
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
			name: 'Details are present',
			before: setContext,
			test: checkDetails,
			after: closeBrowser 
		}
	]);

	pipeline.start();
});
