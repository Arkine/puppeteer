const Piper = require('../../lib/application');
const puppeteer = require('puppeteer');

const exposeFn = require('../../tests/generic/exposeFn.js');

const setContext = async ctx => {
	ctx.browser = await puppeteer.launch({ headless: true });
	ctx.page = await ctx.browser.newPage();

	return ctx;
}

const closeBrowser = async ctx => {
	await ctx.browser.close();
}

describe("Should read local file", () => {
	const pipeline = new Piper({
		name:'Log Local Hosts'
	});

	pipeline.addTests([
		{
			name: 'expose fn logs /etc/hosts',
			before: setContext,
			test: exposeFn,
			after: closeBrowser
		}
	]);

	pipeline.start();
});