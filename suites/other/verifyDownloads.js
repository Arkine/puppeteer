const Piper = require('../../lib/application');
const puppeteer = require('puppeteer');
const path = require('path');

const verifyDownload = require('../../tests/generic/verifyDownload');

const setConext = async (ctx) => {
    ctx.browser = await puppeteer.launch();
    ctx.page = await ctx.browser.newPage();

    return ctx;
}

const closeBrowser = async (ctx) => {
    await ctx.browser.close();
}

describe("Verify Download", () => {
    const pipeline = new Piper({
        name: "Should verify file downloaded properly"
    });

    pipeline.setContext({
        baseUrl: 'https://www.nseindia.com/products/content/equities/equities/homepage_eq.htm',
        downloadsOutputDir: `${path.join(__dirname, '../../tests/downloads')}`
    });

    pipeline.addTests([
        {
            name: 'Verify DL',
            before: setConext,
            test: verifyDownload,
            after: closeBrowser
        }
    ]);

    pipeline.start();
});