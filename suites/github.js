const Piper = require('../lib/application');
const path = require('path');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../.env')});

const loginUser = require('../tests/github/loginUser');
const mobileLayout = require('../tests/github/mobileLayoutTest');

const devices = require('puppeteer/DeviceDescriptors');

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

describe('Github', () => {
	it('Login Tests', async () => {
		const pipeline = new Piper({
			name: 'Login form'
		});

		pipeline.setContext({
			baseUrl: 'https://www.github.com',
			imageOutputDir: path.join(__dirname, '../tests/github/screenshots')
		});

		pipeline.addTests([
			{
				name: 'Logs in with correct credentials',
				before: (ctx) => {
                    return setContext(ctx, {
                        user: {
                            username: process.env.GITHUB_USERNAME,
                            password: process.env.GITHUB_PASSWORD,
                        }
                    });
                } ,
				test: loginUser,
				after: closeBrowser,
			},
		]);

		pipeline.start();
	});
	
	it('Mobile Tests', async () => {
		const pipeline = new Piper({
			name: 'Mobile Layout'
		});

		pipeline.setContext({
			baseUrl: 'https://www.github.com',
			imageOutputDir: path.join(__dirname, '../tests/github/screenshots')
		});

		pipeline.addTests([
			{
				name: 'iPhone X Login',
				before: (ctx) => {
					return setContext(ctx, {
						device: devices['iPhone X'],
					});
				},
				test: mobileLayout,
				after: closeBrowser
			},
			{
				name: 'Galaxy S5 Login',
				before: (ctx) => {
					return setContext(ctx, {
						device: devices['Galaxy S5'],
					});
				},
				test: mobileLayout,
				after: closeBrowser
			}
		]);

		pipeline.start();
	});
});
