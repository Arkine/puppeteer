const Piper = require('../../lib/application');
const puppeteer = require('puppeteer');

const hashNavigation = require('../../tests/generic/hashNavigation');

const setContext = async ctx => {
    ctx.browser = await puppeteer.launch();
    ctx.page = await ctx.browser.newPage();

    return ctx;
}

const closeBrowser = async ctx => {
    await ctx.browser.close();
}

 /**
  * Hash (#) changes aren't considered navigations in Chrome. This makes it
  * tricky to test a SPA that use hashes to change views.
  *
  * This script shows how to observe the view of a SPA changing in Puppeteer
  * by injecting code into the page that listens for `hashchange` events.
  *
  */
describe("Hash Nav", () => {
    it("should detect hash nav changes", () => {
        const pipeline = new Piper({
            name: 'Hash nav check'
        });
        
        pipeline.setContext({
            baseUrl: 'http://localhost:8080'
        });

        pipeline.addTests([
            {
                before: setContext,
                test: hashNavigation,
                after: closeBrowser
            }
        ]);

        pipeline.start();
    });
});