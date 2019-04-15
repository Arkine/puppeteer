const Piper = require('../lib/application');
const path = require('path');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../.env')});

const loginUser = require('../tests/github/loginUser');

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
                    ctx = setContext(ctx, {
                        user: {
                            username: process.env.GITHUB_USERNAME,
                            password: process.env.GITHUB_PASSWORD,
                        }
                    });

                    return ctx;
                } ,
				test: loginUser,
				after: closeBrowser,
			},
		]);

		pipeline.start();
	})
});
