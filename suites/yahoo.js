const Piper = require('../lib/application');
const path = require('path');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../.env')});

const blockResources = require('../tests/yahoo/blockResources');

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

describe('Yahoo', () => {
	it('News Home', async () => {
		const pipeline = new Piper({
			name: 'Login form'
		});

		pipeline.setContext({
			baseUrl: 'https://news.yahoo.com',
			imageOutputDir: path.join(__dirname, '../tests/yahoo/screenshots')
		});

		pipeline.addTests([
			{
				name: 'Blocks all images',
				before: (ctx) => {
                    return setContext(ctx, {
                        resources: ['image', 'script', 'stylesheet']
                    });
                },
				test: blockResources,
				after: closeBrowser,
			},
		]);

		pipeline.start();
	});
});
