const Piper = require('../lib/application');
const puppeteer = require('puppeteer');

const cardCompare = require('../tests/american-express/cardCompare');

const setContext = async ctx => {
    ctx.browser = await puppeteer.launch({ headless: true });
    ctx.page = await ctx.browser.newPage();

    return ctx;
}

const closeBrowser = async ctx => {
    await ctx.browser.close();

    return ctx;
}

describe("American Express", () => {
    it("Compare Cards", () => {
        const pipeline = new Piper({
            name: 'Cards Names'
        });

        pipeline.setContext({
            baseUrl: 'http://open.com'
        });

        pipeline.addTests([
            {
                name: 'Compared Card Names Match',
                before: setContext,
                test: cardCompare,
                after: closeBrowser
            }
        ]);

        pipeline.start();
    }).timeout(0);
});